# LYVO — Conciergerie & marketplace de services premium 🇲🇦

Application mobile (React Native + Expo + TypeScript) permettant de trouver, réserver et payer des services au Maroc : beauté, maison, automobile, voyage, food, famille, livraison…

## Lancer le projet

```bash
npm install
npm run web       # navigateur (le plus rapide pour tester)
npm start         # QR code Expo Go (iPhone / Android)
```

## Ce qui est implémenté

- **Onboarding complet** : splash animé → langue (FR/EN/AR) → bienvenue → téléphone +212 → OTP → profil → permissions → centres d'intérêt
- **Home** : header personnalisé, recherche, catégories, offre du moment, sections (près de vous, mieux notés, recommandé, réserver à nouveau, premium, nouveautés)
- **Explore** : recherche + suggestions + historique, filtres (distance, prix, note, dispo, à domicile…), tri, vue carte
- **Fiche prestataire** : galerie, badges, services/tarifs, horaires, carte, avis, FAQ, favoris/partage/appel/message
- **Réservation en 5 étapes** : service → adresse → date/heure → instructions + code promo (`LYVO20`, `BIENVENUE`) → résumé + paiement
- **Confirmation animée**, **Mes réservations** (à venir/terminées/annulées), **Tracking type Uber** (ETA simulé)
- **Messagerie** (réponses simulées, réservation attachée), **Notifications**, **Favoris**
- **Profil** : infos, adresses, moyens de paiement, **Wallet** (solde, cashback, recharge), **Parrainage**, **Notation** post-prestation, Support/FAQ, langue, légal, déconnexion/suppression

## Architecture

```
src/
  app/          # routes expo-router (écrans)
  components/   # design system réutilisable (Button, Card, Sheet, Toast…)
  theme/        # tokens: couleurs, typo, spacing, radius, glow
  data/         # données mock (Casablanca) + seeds
  stores/       # état global zustand (user, bookings, chat, wallet…)
  services/     # abstractions: api, payment, location, i18n, supabase
  types/        # modèles TypeScript
  utils/        # format MAD/dates, haptics
supabase/
  schema.sql    # schéma PostgreSQL complet (18 tables, prêt à déployer)
```

## Brancher le vrai backend (V2)

1. `npx expo install @supabase/supabase-js`, créer le projet Supabase, exécuter `supabase/schema.sql`
2. Remplacer les implémentations mock dans `src/services/api.ts` (mêmes signatures)
3. Paiement : implémenter `CmiGateway`/`StripeGateway` dans `src/services/payment.ts` — les clés vivent dans des Edge Functions, jamais dans l'app
4. Cartes : brancher `react-native-maps` ou Mapbox via `src/services/location.ts` + remplacer `MapPlaceholder`
