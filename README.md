# Wellness Reflection

## Goals
- Personal wellness entries linked to user accounts
- Ability to view historical entries
- Data analytics/trends over time
- Data export capabilities
- Privacy & Security:
- Data encryption
- Role-based access control
- Secure password handling
- GDPR compliance features

## TODO

### Must have before launch
- [x] Containerize the app
- [x] Move the name to the header 'How are you lately, [name]?' when logged in
- [x] Demo mode - no account needed to generate wellness entries
- [x] Textarea form types overflow in image is working
- [x] Use Redux for State Management
- [ ] Update UI to be more human friendly
    - [x] Change the 1/5 numbers to stars to be selected and allow swipe gestures
    - [x] Make slider control mobile friendly
    - [x] Finalize data types for the form
        - [x] vitality is numerical not string
        - [x] date is a date not a string
        - [x] time is a time not a string
    - [x] Make the input fields larger for touch screens
    - [x] Redesign to focus on Time of Day for entries to the form
        - [x] Move Vitality to their respective time of day sections
        - [x] Move Activity to their respective time of day sections
    - [x] Add a Time Picker
    - [x] Add a Date Picker
    - [x] Add last nights bed time input
    - [x] Update header to use an attractive font
    - [x] Add a logo
    - [x] Add a favicon
    - [ ] Add opengraph image
    - [ ] Add a manifest
    - [ ] Add a robots.txt
    - [ ] Add a sitemap generator
- [ ] Connect form submissions to a database Supabase
    - [ ] Add a database
    - [ ] Add a database connection
    - [ ] Personal wellness entries linked to user accounts
    - [ ] Encrypt data in rest and in route.
    - [ ] Add a database schema
    - [ ] Data export
- [ ] Create a page for the user to view their wellness entries
    - [ ] Add a date picker
    - [ ] Add a search bar

----
### Nice to have
- [ ] Add a test suite
- [ ] Debounce localStorage updates?
    - redux-persist
- [ ] Auto-save form data to database every time user is idle for 5 seconds unless there are costs to supabase
- [ ] Add a motivational quote generator
- [ ] Setup a11y best practices
    - [ ] ARIA labels
    - [ ] Keyboard navigation
    - [ ] Screen reader support
- [ ] Documentation
    - [ ] JSDoc
- [x] Add a CI/CD pipeline
- [ ] Add a Dockerfile
- [ ] Add a Docker Compose file
- [x] Add Authentication and Authorization next-auth
    - [x] OAuth Google
- [ ] Profiles for coaches with assigned roles
    - [ ] Add a profile page
    - [ ] Add a profile edit page
- [ ] Add a dark mode
- [ ] Add a theme switcher
- [ ] Tailwind CSS
- [ ] Redesign the UI
    - [ ] Research UI that works for similar apps