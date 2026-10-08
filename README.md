# Musinity

A web-based social application for discovering music events and connecting users with similar musical preferences.

## About the project

Musinity is a web application designed to help users discover music events based on their musical preferences and interact with other users who share similar interests.

The application allows users to create a profile, select favorite music genres and artists, discover personalized events and participate in topic-based chat rooms.

The project was developed as part of a bachelor's degree project in Computer Science.

## Features

- User registration and login
- Music genre and artist preferences
- Personalized music event recommendations
- Artist search using MusicBrainz API
- Music event search using Ticketmaster API
- Topic-based chat rooms
- Personalized chat rooms based on user preferences
- Local data persistence using browser `localStorage`
- Automatic chat scrolling
- Event filtering and chronological sorting
- Fallback mechanism for limited event availability
- Dark user interface
- Glassmorphism visual style
- Animated WebGL background
- Responsive user interface

## Technologies

### Frontend

- React
- JavaScript
- HTML5
- CSS3
- Vite

### APIs

- MusicBrainz API
- Ticketmaster API

### Browser technologies

- localStorage
- WebGL
- Canvas API
- requestAnimationFrame

## Architecture

Musinity is implemented as a Single Page Application (SPA).

The application follows a client-side architecture in which the React frontend communicates directly with external APIs.

```text
+----------------------+
|      React SPA       |
+----------+-----------+
           |
     +-----+-----+
     |           |
     v           v
MusicBrainz   Ticketmaster
    API           API
     |           |
     +-----+-----+
           |
           v
     User Interface
           |
           v
       localStorage
