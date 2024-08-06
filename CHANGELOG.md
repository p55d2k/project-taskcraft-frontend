# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 06-08-2024

I take my words back - this isn't the full release. But it's close!

It's got a new major version number, as we've made incompatible changes to the project. We've also added a lot of new features and fixed a lot of bugs.

### Added

- Paraphrase Tool

### Changed

- Now we're using Clerk for authentication instead of Firebase!
- With unique usernames, the main way of identifying users is now through their username
- The AI has been improved to be more accurate and helpful with prompt engineering

### Fixed

- There is now a limit to the project title to 100 characters

### Removed

- The home page
- The account page as you can now edit your profile by clicking on your user button in the sidebar

## [0.7.0] - 03-08-2024

Maybe just one last pre-release...?

### Added

- Custom 404 page
- Citation Generator
- Members and mentors can now be added from the project settings page by the project owner

### Changed

- The Account Page header has changed to be more consistent with the rest of the website
- There is now a max limit of the project name to be 100 characters
- Replaced most catgirls with cartoon characters from the firebase homepage

### Fixed

- The AI page would not load if there was an error sending the request to the AI

## [0.6.0] - 02-08-2024

The second-last release before the full release.

### Added

- Project member management
- Project deletion
- Project locking
- Project leaving

### Changed

- The AI has been improved to be more accurate and helpful with prompt engineering
- The user requesting to join the project can choose his role as member or mentor

### Fixed

- Ask AI page bugs in UI when displaying the AI response
- Bugs when the tasks page tries to display a task that the AI created

## [0.5.0] - 01-08-2024

Not much has changed in this release.

### Added

- The ability for AI to create tasks
- Users can request to join a project with the project ID
- Project Settings page

### Changed

- The projects page now will not show the sidebar

## [0.4.0] - 27-07-2024

This is a huge release, with a lot of new features and improvements. We're almost ready for a full release!

### Added

- Meeting functionality

### Fixed

- Attempting to create a project would redirect back to the projects page, but the bug has been fixed

### Changed

- Removed background from the sidebar

## [0.3.0] - 24-07-2024

Improved the website in a lot of different ways - we're getting closer to a full release! <br/>
We also made the code <i>way</i> more cleaner, concise, and readable.

### Added

- The ability to create tasks
- The tasks page
- Improved the dashboard page to show tasks assigned to the user
- Viewing of specific task pages

### Fixed

- Switching between projects now works as expected
- Members can now no longer create tasks, which is expected behaviour

### Changed

- Loading is now global, i.e. it will show when the page is loading, not just when the user is logging in

## [0.2.0] - 22-07-2024

Huge improvement, but there is still gaping holes and gaps in the project.

### Added

- The Ask AI page
- The Chat page
- The Account page

### Changed

- People must select a project in order to continue to the dashboard

### Removed

- The ability for people to choose to accept tasks. Tasks are now assigned to users instead

### In development

- The ability to create tasks
- The tasks page
- The dashboard page

## [0.1.0] - 06-07-2024

First release of the project. Authentication and authorization are implemented, and basic functionality of creating projects exists.

### Added

- Verify Email functionality
- Projects page functionality
- Project creation functionality
