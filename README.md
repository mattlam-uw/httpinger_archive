# HTTPinger

## Dependencies
* node.js (version 0.10.29 or later)

## Installation and Setup
1. Clone this repo
2. CD . . .
3. $ node server.js
4. In browser, navigate to http://localhost:3000/

## Story Backlog
| ID  | Story |
| --- | ----- |
| 11 | As a user, I want to be able to view overall request stats in a web page user interface. |
| 12 | As a user, I want to be able to drill into any request that resulted in error (status code >= 400) and view the full html returned. |
| 13 | As a user, I want to be able to view info around the urls being pinged in a web page user interface. |
| 14 | As a user, I want to be able to modify the name, host, and url information for urls being pinged in a web page user interface. |
| ~~1~~ | ~~As a user, I want to be able to periodically ping a specified URL and have all response codes logged to a specified file.~~ |
| ~~2~~ | ~~As a user, I want to be able to specify more than one URL to periodically ping.~~ |
| ~~3~~ | ~~As a user, I want to be able to specify a constant value to represent how often the ping rounds occur.~~ |
| ~~4~~ | ~~As a user, I want ping results to be written to a log file (not just output to stdout).~~ |
| ~~5~~ | ~~As a user, I want to be able to see the response page data returned for status code 4xx and 5xx responses.~~ |
| ~~6~~ | ~~As a developer, I want all of the url data to be stored in a separate JSON file, which can function as the model up to the point of porting to a database.~~ |
| ~~7~~ | ~~As a developer, I want the bulk of requests to be for headers only in order to increase overall speed and efficiency of the application.~~ |
| ~~8~~ | ~~As a developer, I want to send full page GET requests only in cases where the HEAD request returned a status code of 400 or greater in order to increase efficiency of the application.~~ |
| ~~9~~ | ~~As a developer, I want to organize the code such that related methods are kept in a dedicated module in order to improve codebase navigability.~~ |
| ~~10~~ | ~~As a developer, I want to put a layer of abstraction around all CRUD calls for files so that I can more easily adapt to database if needed in the future.~~ |