import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { colors, gradients, radius, spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Avatar } from '@/components/Avatar';
import { Sheet } from '@/components/Sheet';
import { Button } from '@/components/Button';
import { useUser } from '@/stores/user';
import { useWallet } from '@/stores/wallet';
import { useToast } from '@/stores/toast';
import { LANGS, useLangStore } from '@/services/i18n';
import { mad } from '@/utils/format';
import { tapLight } from '@/utils/haptics';

interface Item {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route?: string;
  action?: 'language' | 'logout' | 'delete';
  danger?: boolean;
  sub?: string;
}

export default function Profile() {
  const { profile, signOut } = useUser();
  const balance = useWallet((s) => s.balance);
  const { lang, setLang } = useLangStore();
  const [langOpen, setLangOpen] = useState(false);
  const [confirm, setConfirm] = useState<'logout' | 'delete' | null>(null);
  const toast = useToast((s) => s.show);

  const sections: { title: string; items: Item[] }[] = [
    {
      title: 'Mon compte',
      items: [
        { icon: 'person-outline', label: 'Informations personnelles', route: '/personal-info' },
        { icon: 'location-outline', label: 'Mes adresses', route: '/addresses' },
        { icon: 'card-outline', label: 'Moyens de paiement', route: '/payment-methods' },
        { icon: 'heart-outline', label: 'Favoris', route: '/favorites' },
      ],
    },
    {
      title: 'Avantages',
      items: [
        { icon: 'wallet-outline', label: 'Wallet LYVO', sub: mad(balance), route: '/wallet' },
        { icon: 'gift-outline', label: 'Invitez vos amis', sub: '+40 MAD offerts', route: '/referral' },
        { icon: 'notifications-outline', label: 'Notifications', route: '/notifications' },
      ],
    },
    {
      title: 'Préférences',
      items: [
        { icon: 'globe-outline', label: 'Langue', sub: LANGS.find((l) => l.id === lang)?.native, action: 'language' },
        { icon: 'help-buoy-outline', label: 'Aide & support', route: '/support' },
        { icon: 'document-text-outline', label: 'Confidentialité & conditions', route: '/legal' },
      ],
    },
    {
      title: 'Session',
      items: [
        { icon: 'log-out-outline', label: 'Déconnexion', action: 'logout' },
        { icon: 'trash-outline', label: 'Supprimer mon compte', action: 'delete', danger: true },
      ],
    },
  ];

  const onItem = (item: Item) => {
    tapLight();
    if (item.route) router.push(item.route);
    else if (item.action === 'language') setLangOpen(true);
    else if (item.action === 'logout') setConfirm('logout');
    else if (item.action === 'delete') setConfirm('delete');
  };

  return (
    <Screen>
      {/* header profil */}
      <View style={styles.head}>
        <Avatar uri={profile.avatar} name={`${profile.firstName} ${profile.lastName}`} size={64} ring />
        <View style={{ flex: 1 }}>
          <Text style={type.h1}>
            {profile.firstName} {profile.lastName}
          </Text>
          <Text style={[type.small, { marginTop: 2 }]}>{profile.phone}</Text>
        </View>
      </View>

      {/* carte wallet */}
      <Pressable onPress={() => router.push('/wallet')}>
        <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.wallet}>
          <View style={{ flex: 1 }}>
            <Text style={styles.walletLabel}>WALLET LYVO</Text>
            <Text style={styles.walletValue}>{mad(balance)}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </LinearGradient>
      </Pressable>

      {sections.map((s) => (
        <View key={s.title}>
          <Text style={[type.label, { marginTop: spacing.xl, marginBottom: spacing.sm }]}>{s.title}</Text>
          <View style={styles.group}>
            {s.items.map((item, i) => (
              <Pressable
                key={item.label}
                onPress={() => onItem(item)}
                style={({ pressed }) => [styles.item, i > 0 && styles.itemBorder, pressed && { opacity: 0.7 }]}>
                <Ionicons name={item.icon} size={19} color={item.danger ? colors.error : colors.violetLight} />
                <Text style={[type.body, { flex: 1, fontSize: 14.5 }, item.danger && { color: colors.error }]}>{item.label}</Text>
                {item.sub && <Text style={type.tiny}>{item.sub}</Text>}
                {!item.danger && <Ionicons name="chevron-forward" size={15} color={colors.textFaint} />}
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      <Text style={[type.tiny, { textAlign: 'center', marginTop: spacing.xl }]}>LYVO v1.0.0 — fait avec soin à Casablanca</Text>

      {/* langue */}
      <Sheet visible={langOpen} onClose={() => setLangOpen(false)} title="Langue">
        {LANGS.map((l) => (
          <Pressable
            key={l.id}
            onPress={() => {
              setLang(l.id);
              setLangOpen(false);
              toast(l.id === 'ar' ? 'تم تغيير اللغة إلى العربية' : `Langue : ${l.native}`, 'success');
            }}
            style={styles.langRow}>
            <Text style={[type.h3, { flex: 1 }]}>{l.native}</Text>
            {lang === l.id && <Ionicons name="checkmark-circle" size={20} color={colors.violetLight} />}
          </Pressable>
        ))}
      </Sheet>

      {/* confirmations */}
      <Sheet
        visible={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm === 'delete' ? 'Supprimer votre compte ?' : 'Se déconnecter ?'}>
        <Text style={type.bodySoft}>
          {confirm === 'delete'
            ? 'Cette action est définitive : réservations, wallet et historique seront supprimés.'
            : 'Vous pourrez vous reconnecter à tout moment avec votre numéro.'}
        </Text>
        <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl }}>
          <Button title="Retour" variant="secondary" onPress={() => setConfirm(null)} style={{ flex: 1 }} />
          <Button
            title={confirm === 'delete' ? 'Supprimer' : 'Déconnexion'}
            variant="danger"
            onPress={() => {
              setConfirm(null);
              signOut();
              toast(confirm === 'delete' ? 'Compte supprimé' : 'À bientôt !', 'info');
              router.replace('/onboarding/language');
            }}
            style={{ flex: 1 }}
          />
        </View>
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  wallet: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  walletLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  walletValue: { color: '#fff', fontSize: 28, fontWeight: '900', marginTop: 4 },
  group: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  itemBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  langRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
});
