1. Initial investigation
  - First i did few investigation prompts to highlith me the high level architecture of the application and how it is structured.
  - Did more in depth prompts to gather specific inforamtion about specific parts of the application and its flows (auth flow, DDD setup,configuation setup, request flows).
  - Went into files to get a general overview of the template and how the code looks and functions.
  - Initial project/repo setup and initial starting of the application

2. Initial Planing on what to focus on based on the current setup
  - Based on the current setup i see that we already have auth and basic user modules and a lot of supplementing modules for auth, validation, logging, guards.
  - Also app is quite good decomposed and all crucial components are independent and seperated by infra/api/domain layars and by individual domains, also we have shared module to share common functionality.
  - Since the major core stuff is already setup i will focus on data modeling and api modleing of the new features, implementing those features and folowing current setup and guidlines while doing so, if i need to i will extend some features of the setup like for example adding role system and role guards or something similar.
3. Data modeling (Org,Member extension of better auth)
  - I decided first to plan out the data model based on information and logic we want to have and create a best and most optimized way for how we want to store our data.
  - I decided to extend bether auth with organization plugin by adding organization and member tables which will link userId with the organization so it will be posible for user to be a member of   multiple organizations (similiar like Slack) only thig is i added a type Field which is part of MemberType enum so we can check the roles of member within domain context (songwriter/manager).
  - I will probably not focus too much on admin/owner roles which are the roles provided by better auth since it is not the focus of the domain for this task.
  - I tried to create composite id's to create necesary uniqunes when creating members and orgs also.
  - System as i mentioned erlier was created so that it will be flexible for each app user to be able to be member of multiple orgs with different roles.
  - I also added indexes for specific fields to optimize specific repository queries that we have on members and organizations.
  - I added orgId on sessions so we can check for which org the user has session id to know which org data he can access or update.
4. Adding org and member modules
 - Update the prisma shcema based on the plan mentioned in section 3. to comply with better auth organization plugin
 - Added module for Organizations (Based on better auth organization extension ) with basic api and all the necesary files, that comply with the current setup and layer split.
 - Added module for Members (Based on better auth organization extension ) with basic api and all the necesary files, that comply with the current setup and layer split.
 - Added RoleGuards that checks user's session orgId and checks if it mathces with desierd org api that he wants to use it also checks if he is a member of that org and also if api is guarded by role access it checks if he has role that he needs to access that api endpoint
 5. Song, Pitch, SongPitch db model planning
 - Add models for song and pitch focus on each model to have all the necesary data.
 - Add other supporting models lik Tag, PitchTag, PitchTargetArtist.
 - Try all models to be normilised as possible and to be scoped with orgId so that it is specified for each org.
 - Add all the necesary indexes fro optimisations and relations.
