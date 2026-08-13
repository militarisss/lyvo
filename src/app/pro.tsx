import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { FadeInUp } from '@/components/Animate';
import { useToast } from '@/stores/toast';
import { mad } from '@/utils/format';
import { notifySuccess } from '@/utils/haptics';

type MissionStatus = 'new' | 'accepted' | 'enroute' | 'arrived' | 'inprogress' | 'done';

const FLOW: { status: MissionStatus; action: string; next: MissionStatus }[] = [
  { status: 'new', action: 'Accepter la mission', next: 'accepted' },
  { status: 'accepted', action: 'Je suis en route', next: 'enroute' },
  { status: 'enroute', action: 'Je suis arrivé', next: 'arrived' },
  { status: 'arrived', action: 'Commencer la prestation', next: 'inprogress' },
  { status: 'inprogress', action: 'Terminer la prestation', next: 'done' },
];

const STATUS_LABEL: Record<MissionStatus, { label: string; tone: 'violet' | 'warning' | 'gold' | 'success' }> = {
  new: { label: 'Nouvelle', tone: 'warning' },
  accepted: { label: 'Acceptée', tone: 'violet' },
  enroute: { label: 'En route', tone: 'gold' },
  arrived: { label: 'Sur place', tone: 'gold' },
  inprogress: { label: 'En cours', tone: 'gold' },
  done: { label: 'Terminée', tone: 'success' },
};

const UPCOMING = [
  { id: 'm2', service: 'Canapé 3 places + anti-acariens', client: 'Salma R.', place: 'Racine, Casablanca', time: '16:30', price: 349 },
  { id: 'm3', service: 'Salon marocain complet', client: 'Youssef T.', place: 'Californie, Casablanca', time: 'Demain 10:00', price: 449 },
];

export default function ProviderMode() {
  const toast = useToast((s) => s.show);
  const [available, setAvailable] = useState(true);
  const [status, setStatus] = useState<MissionStatus>('new');
  const [earned, setEarned] = useState(850);

  const step = FLOW.find((f) => f.status === status);
  const doneCount = status === 'done' ? 3 : 2;

  const advance = () => {
    if (!step) return;
    setStatus(step.next);
    if (step.next === 'done') {
      setEarned((e) => e + 299);
      notifySuccess();
      toast('Mission terminée — 299 MAD ajoutés à vos revenus', 'success');
    } else {
      toast(`Statut mis à jour : ${STATUS_LABEL[step.next].label}`, 'info');
    }
  };

  return (
    <Screen>
      <Header title="Espace prestataire" />

      {/* header pro */}
      <FadeInUp>
        <View style={styles.head}>
          <Avatar uri="https://i.pravatar.cc/150?img=53" name="Mohamed E." size={56} ring />
          <View style={{ flex: 1 }}>
            <Text style={type.h2}>Bonjour Mohamed 👋</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
              <Badge label="LYVO Verified" tone="violet" icon="shield-checkmark" />
              <Badge label="Top Pro" tone="gold" icon="trophy-outline" />
            </View>
          </View>
        </View>

        <Card style={[styles.availRow, { marginTop: spacing.lg }]}>
          <View style={[styles.availDot, { backgroundColor: available ? colors.success : colors.textFaint }]} />
          <Text style={[type.h3, { flex: 1 }]}>{available ? 'Disponible' : 'Indisponible'}</Text>
          <Switch value={available} onValueChange={setAvailable} trackColor={{ false: colors.cardHi, true: colors.violet }} thumbColor="#fff" />
        </Card>
      </FadeInUp>

      {/* stats du jour */}
      <FadeInUp delay={120}>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{doneCount + 1}</Text>
            <Text style={type.tiny}>missions aujourd’hui</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.success }]}>{mad(earned)}</Text>
            <Text style={type.tiny}>revenus du jour</Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.gold }]}>★ 4.9</Text>
            <Text style={type.tiny}>note (1 240 avis)</Text>
          </View>
        </View>
      </FadeInUp>

      {/* mission active */}
      <FadeInUp delay={220}>
        <Text style={[type.h2, { marginTop: spacing.xl, marginBottom: spacing.md }]}>Mission en cours</Text>
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Badge label={STATUS_LABEL[status].label} tone={STATUS_LABEL[status].tone} />
            <Text style={[type.tiny, { marginLeft: 'auto' }]}>Réf. LYV-8412</Text>
          </View>
          <Text style={[type.h3, { marginTop: spacing.md }]}>Canapé 3 places — nettoyage profond</Text>
          <View style={styles.missionMeta}>
            <Ionicons name="person-outline" size={13} color={colors.textFaint} />
            <Text style={type.small}>Badr E. · Rés. Yasmine, Maârif</Text>
          </View>
          <View style={styles.missionMeta}>
            <Ionicons name="time-outline" size={13} color={colors.textFaint} />
            <Text style={type.small}>Aujourd’hui 14:00 · 1 h 30</Text>
          </View>
          <View style={styles.missionMeta}>
            <Ionicons name="cash-outline" size={13} color={colors.textFaint} />
            <Text style={[type.small, { color: colors.success, fontWeight: '700' }]}>{mad(299)} — payé par carte</Text>
          </View>

          {step ? (
            <Button title={step.action} onPress={advance} style={{ marginTop: spacing.lg }} />
          ) : (
            <View style={styles.doneBox}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={[type.small, { color: colors.success, fontWeight: '700' }]}>Mission terminée — en attente de l’avis client</Text>
            </View>
          )}
        </Card>
      </FadeInUp>

      {/* prochaines missions */}
      <FadeInUp delay={320}>
        <Text style={[type.h2, { marginTop: spacing.xl, marginBottom: spacing.md }]}>À venir</Text>
        <View style={{ gap: spacing.sm }}>
          {UPCOMING.map((m) => (
            <Card key={m.id} style={styles.upcoming}>
              <View style={{ flex: 1 }}>
                <Text style={[type.h3, { fontSize: 14.5 }]}>{m.service}</Text>
                <Text style={[type.small, { marginTop: 2 }]}>
                  {m.client} · {m.place}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[type.small, { fontWeight: '700', color: colors.text }]}>{m.time}</Text>
                <Text style={[type.tiny, { color: colors.success, fontWeight: '800', marginTop: 2 }]}>{mad(m.price)}</Text>
              </View>
            </Card>
          ))}
        </View>
      </FadeInUp>

      {/* revenus de la semaine */}
      <FadeInUp delay={420}>
        <Text style={[type.h2, { marginTop: spacing.xl, marginBottom: spacing.md }]}>Cette semaine</Text>
        <Card>
          <View style={styles.chart}>
            {[420, 610, 380, 720, 850, 540, earned].map((v, i) => (
              <View key={i} style={styles.chartCol}>
                <View style={[styles.chartBar, { height: Math.max(8, (v / 900) * 72) }, i === 6 && { backgroundColor: colors.violetLight }]} />
                <Text style={styles.chartDay}>{['L', 'M', 'M', 'J', 'V', 'S', 'D'][i]}</Text>
              </View>
            ))}
          </View>
          <View style={styles.chartTotal}>
            <Text style={type.small}>Total semaine</Text>
            <Text style={[type.h3, { color: colors.success }]}>{mad(3520 + (status === 'done' ? 299 : 0))}</Text>
          </View>
        </Card>
      </FadeInUp>

      <Text style={[type.tiny, { textAlign: 'center', marginTop: spacing.xl }]}>
        Démo du mode prestataire — l’app LYVO Pro complète arrive en V2.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  availRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  availDot: { width: 10, height: 10, borderRadius: 5 },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  stat: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: 3,
  },
  statValue: { color: colors.text, fontSize: 17, fontWeight: '900' },
  missionMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 7 },
  doneBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.successDim,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  upcoming: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 96 },
  chartCol: { alignItems: 'center', gap: 6, flex: 1 },
  chartBar: { width: 16, borderRadius: 5, backgroundColor: colors.violetDim },
  chartDay: { color: colors.textFaint, fontSize: 10, fontWeight: '700' },
  chartTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
