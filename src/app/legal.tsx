import React from 'react';
import { Text } from 'react-native';
import { spacing, type } from '@/theme';
import { Screen } from '@/components/Screen';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';

const SECTIONS = [
  {
    title: 'Conditions d’utilisation',
    body: 'LYVO met en relation des clients et des prestataires de services indépendants au Maroc. La réservation vaut acceptation du tarif affiché. L’annulation est gratuite jusqu’à 2 h avant la prestation ; passé ce délai, des frais peuvent s’appliquer.',
  },
  {
    title: 'Confidentialité',
    body: 'Vos données (profil, adresses, historique) sont utilisées uniquement pour fournir le service. Votre position n’est collectée que lorsque l’app est ouverte. Vous pouvez demander la suppression complète de vos données depuis Profil → Supprimer mon compte.',
  },
  {
    title: 'Paiements',
    body: 'Les paiements par carte sont traités par des prestataires certifiés PCI-DSS (CMI, Stripe). LYVO ne stocke jamais vos numéros de carte.',
  },
];

export default function Legal() {
  return (
    <Screen>
      <Header title="Confidentialité & conditions" />
      {SECTIONS.map((s) => (
        <Card key={s.title} style={{ marginBottom: spacing.md }}>
          <Text style={type.h3}>{s.title}</Text>
          <Text style={[type.bodySoft, { marginTop: spacing.sm, fontSize: 14 }]}>{s.body}</Text>
        </Card>
      ))}
      <Text style={[type.tiny, { textAlign: 'center', marginTop: spacing.lg }]}>Version de démonstration — textes à valider par un juriste avant publication.</Text>
    </Screen>
  );
}
