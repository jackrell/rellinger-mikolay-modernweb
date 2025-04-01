# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-04-01

### Added

- Local players.json file that contains data on NBA players from the 2022-2023 season
- "Manage My Teams" page that allows players to create a new team or edit or delete old ones
- Search filters when creating a new team that allows users to filter by name, team, college, height, and weight
- "View All Teams" page that allows users to view teams created by all users
- Ability to view team details and player details within the team
- Global home button available on all pages besides the home page itself
- Register and login functionalities that allow a user to create an account
- Protected route that only allows logged in users to access the "Manage My Teams" page

### Changed

- Homepage buttons are now "Manage My Teams" and "View All Teams" instead of "Users" and "Classes"
- Main data source is now nba players rather than yoga classes
- App purpose is now to build an NBA team instead of sign up for yoga classes

### Removed

- Replaced old components that created the Yoga App

## [0.2.1] - 2025-03-06

### Changed

- Included environmental variables in src/environment.js

## [0.2.0] - 2025-03-06

### Added

- Welcome page with options to manage users and classes
- User page with sign in and option to create user
- Class page allowing instructors to create, edit, or delete a class
- Ability to view users enrolled in a class

### Changed

- Functions to filter classes now moved to seperate pages

### Removed

- Table to view classes
- Search bar to find classes on hoempage

## [0.1.0] - 2025-02-20

### Added

- Yoga class listing table with class name, instructor, time, level, and sign-up button
- Search bar for filtering classes by name
- Dropdown filter for selecting yoga class levels (Beginner, Intermediate, Advanced)
- Responsive design to support different screen sizes

### Changed

### Fixed
