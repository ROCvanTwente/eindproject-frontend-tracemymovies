# TraceMyMovies 🎬

TraceMyMovies is een uitgebreide full-stack webapplicatie waarmee filmliefhebbers hun favoriete films kunnen bijhouden, reviews kunnen schrijven en in contact kunnen komen met vrienden om film aanbevelingen te delen.

## ✨ Functionaliteiten

- **Authenticatie & Profielen:** Registreer, log in en beheer je eigen gebruikersprofiel.
- **Movie Database Integratie:** Zoek naar films via de TMDB (The Movie Database) API.
- **Watch Log:** Houd nauwkeurig bij welke films je op welke datum hebt bekeken. Geef aan of het een 'rewatch' is en voeg direct een score toe.
- **Uitgebreid Review Systeem:**
  - Beoordeel films met een score van 1 tot 10.
  - Schrijf uitgebreide reviews (max 500 tekens).
  - Markeer reviews die spoilers bevatten zodat andere gebruikers gewaarschuwd worden.
  - Like de reviews van andere gebruikers.
  - Bewerk of verwijder je eigen reviews.
- **Berichten / Chat:** Chat met je filmvrienden en deel direct filmreferenties in je berichten.

## 🛠️ Tech Stack

### Frontend
- **Framework:** [React](https://reactjs.org/) (met [Vite](https://vitejs.dev/))
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Iconen:** [Lucide React](https://lucide.dev/)
- **Notificaties:** [Sonner](https://sonner.emilkowal.ski/)
- **Datumverwerking:** date-fns

### Backend (API)
- **Framework:** .NET (C#)
- **Database:** Entity Framework Core (SQL Server)

## 🚀 Installatie & Setup

Volg deze stappen om het project lokaal te draaien:

### Vereisten
- [Node.js](https://nodejs.org/) geïnstalleerd.
- Een draaiende backend API (verwacht op `https://localhost:7112`).

### Frontend opzetten

1. Clone de repository en navigeer naar de frontend map:
   ```bash
   cd eindproject-frontend-tracemymovies
   ```

2. Installeer de afhankelijkheden:
   ```bash
   npm install
   ```

3. Configureer de omgevingsvariabelen. Maak een `.env.local` bestand aan in de root van de frontend met bijvoorbeeld:
   ```env
   VITE_API_BASE_URL=https://localhost:7112/api
   ```

4. Start de ontwikkelserver:
   ```bash
   npm run dev
   ```

## 🤝 Bijdragen

Dit is een eindproject ontwikkeld voor het ROC van Twente. Pull requests en suggesties voor verbeteringen zijn altijd welkom!

## 📄 Licentie

Dit project is open-source en beschikbaar onder de MIT licentie.