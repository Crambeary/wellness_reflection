# Wellness Reflection

## Goals
- [x] Personal wellness entries linked to user accounts
- [x] Ability to view historical entries
- [ ] Data analytics/trends over time
- [ ] Data export capabilities
- [ ] Data encryption
- [ ] Role-based access control
- [ ] Secure password handling
- [ ] GDPR compliance features

## TODO

### Must have before launch
- [x] Componentize the app
- [x] Add a CI/CD pipeline
- [x] Move the name to the header 'How are you lately, [name]?' when logged in
- [x] Demo mode - no account needed to generate wellness entries
- [x] Textarea form types overflow in image is working
- [x] Use Redux for State Management
- [x] Update UI to be more human friendly
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
    - [x] Add opengraph image
    - [x] Add a manifest
    - [x] Add a robots.txt
    - [x] Add a sitemap generator
- [x] Add Authentication and Authorization next-auth
    - [x] OAuth Google
- [x] Connect form submissions to a database Supabase
    - [x] Add a database
    - [x] Add a database connection
    - [x] Personal wellness entries linked to user accounts
    - [x] Encrypt data in rest and in route. - default behavior of supabase
    - [x] Load todays data from database on page load
- [x] Debounce localStorage updates?
- [x] Reorganize the sections Meals > Cravings > Notes
- [x] Remove the "Morning Meals" etc. Sub Headers
- [x] Set redirect with wildcards and NEXT_VERCEL env. Check ticktick link
- [ ] Improve the UI to work with a database as the source of truth
    - [x] Move date selection to be a navbar
        - [x] Load selected date data from database to the form
    - [x] Change data in the form to come from the db on date change if it exists
    - [x] Move name to be seen at the top of the page
    - [x] Fix switching to a date with no db data
    - [x] Fix loading the page while the db has no date for "today"
    - [x] Load todays data from database on authentication
    - [x] Move the buttons to be spaced evenly at the bottom of the form
    - [x] Show success message about saving data
        - [x] On submit turn the button into a spinner
        - [x] On success response turn the button into a success message
        - [x] After 2 seconds turn the button back to the original text
    - [x] UI Show error when saving without authentication
    - [x] Show errors about db in the UI
    - [x] Explain a benefits of logging in as modal when attempting to save without authentication
    - [ ] Use local form for today's data after logging in unless a db form exists
    - [x] Modal to confirm leaving the page or changing date with unsaved data - localStorage is diverged than db
        - "You have unsaved data, are you sure you want to load another date?"
    - [x] Modal to confirm clear form
        - "You have unsaved data, are you sure you want to clear the form?"
    - [x] Add a Modal to confirm logout
    - [x] Show user email in the header
- [x] Define app behavior for unauthenticated users
    - Change dates without changing form contents and no modal warning?
- [ ] Fix all errors
    - [ ] Fix error with saving before pressing today button
    - [x] Hide the Extra Options button on image export
    - [x] Hide error alerts on image export
    - Idle and console shows this error:
        ```
            VM7781:1 
                Uncaught (in promise) SyntaxError: "[object Object]" is not valid JSON
                    at JSON.parse (<anonymous>)
                    at l._storageChangeDispatcher (content.js:2:898238)
                    at _storageChangeDispatcherCallback (content.js:2:897686)
                _storageChangeDispatcher	@	content.js:2
                _storageChangeDispatcherCallback	@	content.js:2
        ```
    - [ ] Make sure that all elements do not change from controlled to uncontrolled and vice versa
    - [ ] Fix authenticate error on login from vercel main site
----
### Nice to have
- [ ] Tailwind CSS replacing bootstrap
- [ ] Add a test suite
- [ ] Add a dark mode
- [ ] Add a theme switcher
- [ ] Set days loaded to be a URL parameter day=2024-12-12 always sets the date if logged in
- [ ] Change localStorage to redux-persist
- [ ] Auto-save form data to database every time user is idle for 5 seconds unless there are costs to supabase
- [ ] Merge the db with local storage if a field was empty before
- [ ] Add a motivational quote generator
- [ ] Add a data export feature
- [ ] Setup a11y best practices
    - [ ] ARIA labels
    - [ ] Keyboard navigation
    - [ ] Screen reader support
- [ ] Documentation
    - [ ] JSDoc
- [ ] Create a page for the user to view their wellness entries and analytics
    - [ ] Add a date picker
    - [ ] Add a search bar
- [ ] Add a Dockerfile
- [ ] Add a Docker Compose file
- [ ] Profiles for coaches with assigned roles
    - [ ] Edit name
    - [ ] Profile picture
- [ ] Redesign the UI
    - [ ] Research UI that works for similar apps
- [ ] Automatically ask users if they want to change timezone
- [ ] Add a privacy policy
- [ ] Add a terms of service
- [ ] Add a cookie policy
- [ ] Profile page with edit options
    - [ ] Add a profile edit page
    - [ ] Onboard with time zone
    - [ ] Save prolile user data to database 
- [ ] Admin dashboard
    - [ ] Configure roles and permissions
    - [ ] View user data
    - [ ] View wellness data
    - [ ] View analytics data
- [ ] Gamification
    - [ ] Add a leaderboard
    - [ ] Add a points system
    - [ ] Add a rewards system  
- [ ] Add a mobile app PWA refresh on pulldown
- [ ] Add a mobile app PWA install prompt
- [ ] Add a mobile app PWA badge in the header

