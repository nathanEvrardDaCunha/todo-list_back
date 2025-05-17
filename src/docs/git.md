### Commit Prefix

Commons commit prefix:

-   feat: add new functionality visible by the client side
-   fix: fix bugs and edge cases
-   refactor: rewrite functionality without being visible by the client side
-   build: setup tools and configuration for the project
-   style: changes focusing only on enhancing style and readability without refactoring
-   chore: everything else

Customs commit prefix:

-   stash: store work in progress intentionally in repository for later references
-   security: can be replaced by fix
-   docs: everything related to project documentations and conventions

### Commit Scope

Commons commit scope:

-   auth: changes only made to authentication logics
-   database: changes only made to database logics
-   core: changes related to the critical and overall parts of the project
-   "empty": small non important changes

Customs commit scope:

-   data: can be replaced by database
-   docs: everything related to project documentations and conventions

### Commit Branch

Commons commit branch:

-   development: branch to separate work in progress from production to avoid issues later
-   feat: branch to develop a specific new feature visible by the client side
-   fix: branch to fix any bug or edge case

Customs commit branch:

-   refactor: branch to refactor one specific feature overall without impacting client side
-   stash: store work in progress intentionally in repository for later references
