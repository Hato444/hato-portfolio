"use strict";

// Project evidence and editable case-study copy shared by all entry points.
const PROJECTS = [
  {
    id: "oxsnow", name: "Oxsnow Studio", mark: "OX", x: 390, y: 160,
    category: "Film / Digital Platform", status: "Live website", description: "A creative technology and film platform showcasing cinematic projects and digital experiences.",
    stack: [["Next.js", "nextjs"], ["React", "react"], ["JavaScript", "javascript"]],
    live: "https://oxsnow.vercel.app/", source: "https://github.com/Hato444/oxsnow",
    image: "public/media/projects/oxsnow-website.png", imageCaption: "Screenshot of the live Oxsnow Studio homepage",
    problem: "Basotho films and stories need a discoverable digital space for audiences to explore the studio's work.",
    solution: "A film-studio website brings together a film catalogue, trailers, studio information and a rental-oriented VOD storefront.",
    contribution: "Review needed: specify Keletso's individual design and engineering contributions to the platform.",
    implementation: "The public repository identifies a Next.js application. The live films page presents film categories and trailer actions; the VOD page presents rental and subscription options. Payment completion has not been verified.",
    features: ["Film catalogue and genre filters", "Trailer actions", "VOD storefront and rental-oriented interface", "Studio and contact information"],
    lessons: "Review needed: add documented engineering challenges, decisions and lessons from the project."
  },
  {
    id: "hareyeng", name: "HA RE YENG", mark: "HY", x: 445, y: 335,
    category: "Events Landing Website", status: "Live student concept", description: "A responsive Lesotho events website featuring cultural and entertainment experiences.",
    stack: [["HTML5", "html5"], ["CSS3", "css3"], ["Local media"]], live: "https://bejewelled-beignet-e43cfc.netlify.app/",
    image: "public/media/projects/hareyeng-homepage.png", imageCaption: "Screenshot of the live HA RE YENG homepage",
    problem: "Present information about Lesotho cultural and entertainment events in an accessible, engaging landing page.",
    solution: "An independent student showcase introduces three events, their cultural context and links to organisers and coverage.",
    contribution: "Review needed: specify the individual design and implementation work contributed by Keletso.",
    implementation: "A responsive HTML and CSS landing page uses locally stored imagery and video. The site identifies itself as an independent student concept, not an organiser's booking service.",
    features: ["Event descriptions and external organiser links", "Responsive event and culture sections", "Locally hosted images and video", "Planning information with unconfirmed details identified"],
    lessons: "Review needed: add documented implementation challenges and lessons."
  },
  {
    id: "dlala", name: "DLALA", mark: "DL", x: 230, y: 420,
    category: "Java Desktop Application", status: "Coursework project", description: "A desktop media player for organizing and playing music and video.",
    stack: [["Java", "java"], ["JavaFX", "javafx"]], source: "https://github.com/Hato444/-DLALA",
    image: "public/media/projects/dlala-orange.png",
    problem: "Explore desktop media playback and organisation as part of a university software assignment.",
    solution: "A JavaFX media-player application indexes local media and presents it in a desktop interface.",
    contribution: "The portfolio identifies DLALA as Keletso's coursework project. Review needed: describe specific individual implementation responsibilities.",
    implementation: "The repository separates controller, model, service and UI packages. Its diagnostic harness indexes files and tests JavaFX Media and MediaPlayer creation, including audio and video metadata.",
    features: ["Local media indexing", "Audio and video media handling", "Title, artist, album, artwork and duration metadata where available", "JavaFX media diagnostic harness"],
    lessons: "Review needed: document actual implementation challenges and lessons learned."
  },
  {
    id: "tenkonverta", name: "TENKONVERTA", mark: "TK", x: 320, y: 300,
    category: "Windows Desktop Application", status: "Source available · installer not published", description: "A desktop application for downloading videos and playlists.",
    stack: [["Electron"], ["JavaScript", "javascript"], ["Node.js", "nodejs"]], source: "https://github.com/Hato444/TENKONVERTA",
    image: "public/media/projects/tenkonverta.png",
    problem: "Make downloading videos and playlists accessible through a desktop interface.",
    solution: "An Electron application provides a desktop interface for downloading media and processing audio or video.",
    contribution: "Review needed: specify Keletso's individual work adapting and developing the application.",
    implementation: "The repository describes a Windows Electron application using yt-dlp for downloads and FFmpeg for media processing. It is adapted from ArcDLP, with attribution and license notices retained in the source.",
    features: ["Video and playlist downloads", "Audio extraction", "Multiple formats and qualities", "Windows desktop interface"],
    lessons: "Review needed: add documented engineering challenges and lessons."
  },
  {
    id: "onegov", name: "OneGov Lesotho", mark: "OG", x: 165, y: 235,
    category: "Government Services Prototype", status: "Prototype · not an official government system", description: "A civic technology initiative exploring more accessible digital services.",
    stack: [["React", "react"], ["Vite"], ["Node.js", "nodejs"], ["Express", "express"]], source: "https://github.com/Hato444/-onegov-lesotho",
    problem: "Explore how fragmented departmental information could be presented around a unified citizen profile.",
    solution: "A prototype explores a shared citizen profile and interdepartmental service requests across Home Affairs, Traffic, Finance, Pensions, Police and Passport Services. Departments can review sent and received requests, including the citizen, destination, priority and status; the receiving department can respond. It is not an official government system.",
    contribution: "Review needed: identify Keletso's specific contributions to the prototype and its subsequent implementation.",
    implementation: "The repository describes a React/Vite client and Node.js/Express API based on an HTML prototype, with in-memory seed data, authenticated sessions and service-request routes.",
    features: ["Citizen search and profile views", "Departmental service-request workflows", "Notifications and analytics views", "Prototype API with in-memory data"],
    lessons: "The repository identifies database persistence and role-based access as next steps. Review needed: add first-hand challenges and lessons."
  }
];
