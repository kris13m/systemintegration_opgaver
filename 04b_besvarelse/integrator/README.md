# Martin Madsen 04b database

## Hvordan man kører databasen

Databasen køres ved at køre den inkluderede docker compose fil.

`docker compose --file docker-compose.yml up --build --detach`

PostgreSQL kører på `localhost:5432`.

### PgAdmin 4

PgAdmin 4 kører på `localhost:8081`.

```
login: user@domain.com
password: SuperSecret
```

Inde i servergruppen, kaldet "04b server", er der flere forskellige "servere" defineret. Dette er i virkeligheden forskellige brugerlogins til den samme database.

### Andre frontends/CLI

Tjek `init.sql` eller nedestående sektion for brugernavne og logins til hver bruger.

# The Universe

Greasy Slop Stops LLC is a proud, American, family-owned business of roadside fast food chain restaurants.

## The Characters (and their logins and passwords)

### Admin - Admin

```
login: psql_user
password: psql_password
```

### Janine Waters - Employee

```
login: janine
password: password1
```

### Dirk Dudley - Manager

```
login: dirk
password: hunter2
```

### Anthony Coleman - Employee

```
login: anthony
password: hunter2
```

### Elaine Harper - Manager

```
login: elaine
password: qwerty123
```

## Scenarios to help explore the limitations of privileges.

### Janine ties the knot

Janine has just married her High School sweetheart.

As is custom in her home state, she has taken her husband's last name. Janine's last name is now Haynes.

Managers can see and edit all employees that they manage, and thus, it is now up to her manager, Dirk, to update her last name in the database.

### Anthony asks for a raise

Anthony has just asked his manager, Elaine, for a raise.

As he has been only been paid minimum wage for the last three years, Elaine has granted Anthony a pay raise of three dollars an hour.

It is now up to Anthony's manager, Elaine, to update his wage.