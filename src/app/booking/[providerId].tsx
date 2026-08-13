import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { Calendar } from '@/components/Calendar';
import { EmptyState } from '@/components/EmptyState';
import { providerById } from '@/data/providers';
import { PROMO_CODES, SERVICE_FEE_MAD } from '@/data/seed';
import { PAYMENT_METHODS, getGateway } from '@/services/payment';
import { useUser } from '@/stores/user';
import { useBookings } from '@/stores/bookings';
import { useWallet } from '@/stores/wallet';
import { useToast } from '@/stores/toast';
import { mad, shortDate, uid } from '@/utils/format';
import type { Booking } from '@/types/models';
import { notifyError, notifySuccess, tapLight } from '@/utils/haptics';

const STEPS = ['Service', 'Adresse', 'Date', 'Détails', 'Paiement'] as const;

export default function BookingWizard() {
  const { providerId, serviceId } = useLocalSearchParams<{ providerId: string; serviceId?: string }>();
  const p = providerById(providerId ?? '');
  const { addresses, defaultAddressId } = useUser();
  const addBooking = useBookings((s) => s.add);
  const wallet = useWallet();
  const toast = useToast((s) => s.show);

  const [step, setStep] = useState(0);
  const [svcId, setSvcId] = useState<string | null>(serviceId ?? null);
  const [addressId, setAddressId] = useState<string>(defaultAddressId);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [instructions, setInstructions] = useState('');
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState<(typeof PROMO_CODES)[number] | null>(null);
  const [payId, setPayId] = useState('card');
  const [paying, setPaying] = useState(false);

  const service = p?.services.find((s) => s.id === svcId) ?? null;
  const needsAddress = service?.atHome ?? true;

  const totals = useMemo(() => {
    const price = service?.priceMad ?? 0;
    const fees = SERVICE_FEE_MAD;
    let discount = 0;
    if (promoApplied) discount = promoApplied.type === 'percent' ? Math.round((price * promoApplied.value) / 100) : promoApplied.value;
    discount = Math.min(discount, price);
    return { price, fees, discount, total: Math.max(0, price + fees - discount) };
  }, [service, promoApplied]);

  if (!p) {
    return (
      <Screen>
        <Header title="Réservation" />
        <EmptyState icon="alert-circle-outline" title="Prestataire introuvable" text="Impossible de démarrer la réservation." actionLabel="Retour" onAction={() => router.back()} />
      </Screen>
    );
  }

  const canNext =
    step === 0 ? !!service : step === 1 ? (!needsAddress || !!addressId) : step === 2 ? !!date && !!time : true;

  const applyPromo = () => {
    const found = PROMO_CODES.find((c) => c.code === promo.trim().toUpperCase());
    if (found) {
      setPromoApplied(found);
      notifySuccess();
      toast(`Code ${found.code} appliqué — ${found.label}`, 'success');
    } else {
      notifyError();
      toast('Code promo invalide', 'error');
    }
  };

  const confirm = async () => {
    if (!service || !date || !time) return;
    if (payId === 'wallet' && wallet.balance < totals.total) {
      toast('Solde wallet insuffisant', 'error');
      return;
    }
    setPaying(true);
    const bookingId = uid('bk');
    const result = await getGateway().pay({ bookingId, amountMad: totals.total, methodId: payId });
    if (!result.ok) {
      setPaying(false);
      toast(result.error ?? 'Paiement refusé', 'error');
      return;
    }
    if (payId === 'wallet') wallet.pay(totals.total, service.name);
    const method = PAYMENT_METHODS.find((m) => m.id === payId);
    const booking: Booking = {
      id: bookingId,
      providerId: p.id,
      serviceId: service.id,
      serviceName: service.name,
      providerName: p.name,
      cover: p.cover,
      date,
      time,
      addressLine: needsAddress ? (addresses.find((a) => a.id === addressId)?.line ?? '') : p.address,
      priceMad: totals.price,
      feesMad: totals.fees,
      discountMad: totals.discount,
      totalMad: totals.total,
      status: 'confirmed',
      paymentMethod: method?.sub ?? method?.label ?? 'Carte',
      instructions: instructions || undefined,
      promoCode: promoApplied?.code,
      trackable: service.atHome,
    };
    addBooking(booking);
    notifySuccess();
    router.replace(`/booking-confirmed/${bookingId}`);
  };

  return (
    <Screen scroll={false} bottomSpace={90}>
      <Header title={p.name} />

      {/* progression */}
      <View style={styles.steps}>
        {STEPS.map((label, i) => (
          <View key={label} style={{ flex: 1, alignItems: 'center', gap: 5 }}>
            <View style={[styles.stepDot, i <= step && styles.stepDotOn]}>
              {i < step ? <Ionicons name="checkmark" size={11} color="#fff" /> : <Text style={styles.stepNum}>{i + 1}</Text>}
            </View>
            <Text style={[styles.stepLabel, i === step && { color: colors.text }]}>{label}</Text>
          </View>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }}>
        {step === 0 && (
          <View style={{ gap: spacing.sm }}>
            <Text style={[type.label, { marginBottom: spacing.sm }]}>Choisissez un service</Text>
            {p.services.map((s) => {
              const active = svcId === s.id;
              return (
                <Card key={s.id} onPress={() => setSvcId(s.id)} style={[styles.option, active && styles.optionActive]}>
                  <View style={{ flex: 1 }}>
                    <Text style={type.h3}>{s.name}</Text>
                    <Text style={[type.tiny, { marginTop: 3 }]}>
                      {s.durationMin >= 60 ? `${Math.round(s.durationMin / 60)} h` : `${s.durationMin} min`}
                      {s.atHome ? ' · à domicile' : ' · sur place'}
                    </Text>
                  </View>
                  <Text style={styles.optionPrice}>{mad(s.priceMad)}</Text>
                  <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={19} color={active ? colors.violetLight : colors.textFaint} />
                </Card>
              );
            })}
          </View>
        )}

        {step === 1 && (
          <View style={{ gap: spacing.sm }}>
            <Text style={[type.label, { marginBottom: spacing.sm }]}>{needsAddress ? 'Où intervenons-nous ?' : 'Lieu de la prestation'}</Text>
            {!needsAddress ? (
              <Card>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <Ionicons name="storefront-outline" size={20} color={colors.violetLight} />
                  <View style={{ flex: 1 }}>
                    <Text style={type.h3}>Chez {p.name}</Text>
                    <Text style={[type.small, { marginTop: 2 }]}>{p.address}, {p.city}</Text>
                  </View>
                </View>
              </Card>
            ) : (
              <>
                {addresses.map((a) => {
                  const active = addressId === a.id;
                  return (
                    <Card key={a.id} onPress={() => setAddressId(a.id)} style={[styles.option, active && styles.optionActive]}>
                      <Ionicons name={a.label === 'Maison' ? 'home-outline' : a.label === 'Travail' ? 'business-outline' : 'location-outline'} size={19} color={colors.violetLight} />
                      <View style={{ flex: 1, marginLeft: spacing.sm }}>
                        <Text style={type.h3}>{a.label}</Text>
                        <Text style={[type.small, { marginTop: 2 }]}>{a.line}</Text>
                      </View>
                      <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={19} color={active ? colors.violetLight : colors.textFaint} />
                    </Card>
                  );
                })}
                <Button title="Ajouter une adresse" variant="ghost" icon="add-outline" size="md" onPress={() => router.push('/addresses')} />
              </>
            )}
          </View>
        )}

        {step === 2 && <Calendar date={date} time={time} onDate={setDate} onTime={setTime} />}

        {step === 3 && (
          <View style={{ gap: spacing.lg }}>
            <Input
              label="Instructions (optionnel)"
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Digicode, étage, préférences…"
              multiline
              numberOfLines={3}
              style={{ minHeight: 0 }}
            />
            <View>
              <Text style={[type.label, { marginBottom: 8 }]}>Code promo</Text>
              <View style={{ flexDirection: 'row', gap: spacing.sm }}>
                <View style={{ flex: 1 }}>
                  <Input value={promo} onChangeText={setPromo} placeholder="LYVO20" autoCapitalize="characters" />
                </View>
                <Button title="Appliquer" variant="secondary" size="md" onPress={applyPromo} style={{ height: 52 }} />
              </View>
              {promoApplied && (
                <View style={styles.promoOk}>
                  <Ionicons name="pricetag" size={13} color={colors.success} />
                  <Text style={{ color: colors.success, fontSize: 13, fontWeight: '700' }}>
                    {promoApplied.code} — {promoApplied.label}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {step === 4 && service && date && time && (
          <View style={{ gap: spacing.lg }}>
            {/* résumé */}
            <Card>
              <Text style={[type.label, { marginBottom: spacing.md }]}>Résumé</Text>
              <SummaryRow icon="sparkles-outline" text={service.name} />
              <SummaryRow icon="business-outline" text={p.name} />
              <SummaryRow icon="calendar-outline" text={`${shortDate(date)} à ${time}`} />
              <SummaryRow
                icon="location-outline"
                text={needsAddress ? (addresses.find((a) => a.id === addressId)?.line ?? '—') : `${p.address}, ${p.city}`}
              />
              {instructions ? <SummaryRow icon="chatbox-outline" text={instructions} /> : null}
              <View style={styles.sep} />
              <PriceRow label="Prestation" value={mad(totals.price)} />
              <PriceRow label="Frais de service" value={mad(totals.fees)} />
              {totals.discount > 0 && <PriceRow label={`Réduction (${promoApplied?.code})`} value={`- ${mad(totals.discount)}`} accent />}
              <View style={styles.sep} />
              <View style={styles.totalRow}>
                <Text style={type.h3}>Total</Text>
                <Text style={styles.totalValue}>{mad(totals.total)}</Text>
              </View>
            </Card>

            {/* paiement */}
            <View>
              <Text style={[type.label, { marginBottom: spacing.sm }]}>Moyen de paiement</Text>
              <View style={{ gap: spacing.sm }}>
                {PAYMENT_METHODS.map((m) => {
                  const active = payId === m.id;
                  const walletShort = m.id === 'wallet' && wallet.balance < totals.total;
                  return (
                    <Card
                      key={m.id}
                      onPress={() => {
                        if (walletShort) {
                          toast(`Solde insuffisant (${mad(wallet.balance)})`, 'error');
                          return;
                        }
                        setPayId(m.id);
                      }}
                      style={[styles.option, active && styles.optionActive, walletShort && { opacity: 0.5 }]}>
                      <Ionicons name={m.icon as keyof typeof Ionicons.glyphMap} size={20} color={colors.violetLight} />
                      <View style={{ flex: 1, marginLeft: spacing.sm }}>
                        <Text style={type.h3}>{m.label}</Text>
                        {(m.sub || m.id === 'wallet') && (
                          <Text style={[type.tiny, { marginTop: 2 }]}>{m.id === 'wallet' ? `Solde : ${mad(wallet.balance)}` : m.sub}</Text>
                        )}
                      </View>
                      <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={19} color={active ? colors.violetLight : colors.textFaint} />
                    </Card>
                  );
                })}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* barre bas */}
      <View style={styles.bottom}>
        {step > 0 && (
          <Button
            title="Retour"
            variant="secondary"
            onPress={() => {
              tapLight();
              setStep((s) => s - 1);
            }}
            style={{ flex: 1 }}
          />
        )}
        {step < STEPS.length - 1 ? (
          <Button title="Continuer" disabled={!canNext} onPress={() => setStep((s) => s + 1)} style={{ flex: 2 }} />
        ) : (
          <Button title={`Payer ${mad(totals.total)}`} loading={paying} onPress={confirm} style={{ flex: 2 }} />
        )}
      </View>
    </Screen>
  );
}

function SummaryRow({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.summaryRow}>
      <Ionicons name={icon} size={15} color={colors.violetLight} />
      <Text style={[type.body, { fontSize: 14, flex: 1 }]}>{text}</Text>
    </View>
  );
}

function PriceRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.priceRow}>
      <Text style={type.small}>{label}</Text>
      <Text style={[type.body, { fontSize: 14, fontWeight: '600' }, accent && { color: colors.success }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  steps: { flexDirection: 'row', marginBottom: spacing.xl },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotOn: { backgroundColor: colors.violet, borderColor: colors.violetLight },
  stepNum: { color: colors.textSoft, fontSize: 11, fontWeight: '800' },
  stepLabel: { color: colors.textFaint, fontSize: 10, fontWeight: '600' },
  option: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  optionActive: { borderColor: colors.violetLight, backgroundColor: colors.cardHi },
  optionPrice: { color: colors.violetLight, fontWeight: '800', fontSize: 14, marginRight: 4 },
  promoOk: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  sep: { height: 1, backgroundColor: colors.line, marginVertical: spacing.md },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalValue: { color: colors.violetLight, fontSize: 20, fontWeight: '900' },
  bottom: { flexDirection: 'row', gap: spacing.md, paddingTop: spacing.md },
});
