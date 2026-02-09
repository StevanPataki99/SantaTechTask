1. Initial investigation
  - First i did few investigation prompts to highlith me the high level architecture of the application and how it is structured.
  - Did more in depth prompts to gather specific inforamtion about specific parts of the application and its flows (auth flow, DDD setup,configuation setup, request flows).
  - Went into files to get a general overview of the template and how the code looks and functions.
  - Initial project/repo setup and initial starting of the application

2. Initial Planing on what to focus on based on the current setup
  - Based on the current setup i see that we already have auth and basic user modules and a lot of supplementing modules for auth, validation, logging, guards.
  - Also app is quite good decomposed and all crucial components are independent and seperated by infra/api/domain layars and by individual domains, also we have shared module to share common functionality.
  - Since the major core stuff is already setup i will focus on data modeling and api modleing of the new features, implementing those features and folowing current setup and guidlines while doing so, if i need to i will extend some features of the setup like for example adding role system and role guards or something similar.
