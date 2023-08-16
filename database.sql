create table users(
"id" serial primary key,
"position_id" integer NOT NULL,
"patronymic" VARCHAR(50) not null,
"surname" VARCHAR(50) not null,
"username" VARCHAR(50) not null,
"phone" VARCHAR(50) not null,
"email" VARCHAR(50) not null,
"inn" VARCHAR(50),
"recvizit" VARCHAR(50),
"document_mashina" text,
"prava" text,
"fomo" text,
"login" VARCHAR(100) NOT NULL,
"password" VARCHAR(100) not null,
UNIQUE(email),
UNIQUE(phone),
UNIQUE(inn),
"time_create" timestamp default current_timestamp not null,
"time_update" timestamp default current_timestamp not null
);
create table position (
"id" serial primary key,
"position_name" VARCHAR(50),
"time_create" timestamp default current_timestamp not null,
"time_update" timestamp default current_timestamp not null   
);
create table aksiya(
    "id" serial primary key,
    "title" VARCHAR (50) NOT NULL,
    "image" text,
    "description" text,
    "start_day" date,
    "end_day" date,
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
);
create table news(
    "id" serial primary key,
    "title" VARCHAR (50),
    "description" text,
    "image" text,
    "min_description" text,
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
);
create table compony(
    "id" serial primary key,
    "logo" text,
    "phone" VARCHAR (50),
    "telegram" VARCHAR (50),
    "email" VARCHAR (50) NOT NULL,
    "whatsapp" VARCHAR (50),
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp NOT NULL
);
create table homeiy(
    "id" serial primary key,
    "image" text,
    "link" text NOT NULL,
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null

);
create table skachat_pridlachenu(
    "id" serial primary key,
    "image" text,
    "title" VARCHAR (50),
    "deskription" text,
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
);
create table preferences (
    "id" serial primary key,
    "image" text,
    "title" VARCHAR (50) ,
    "description" text,
    "liso" VARCHAR  (1),
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
    
);
create table category(
    "id" serial primary key,
    "image" text,
    "title" VARCHAR (50) ,
    "description" text,
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
);
create table product(
    "id" serial primary key,
    "description" text,
    "sena" integer default 0 NOT NULL,
    "marka" text,
    "stay" text,
    "liquid" boolion not nul,
    "storage" text,
    "against" text,
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
);
create table tarif(
    "id" serial primary key,
    "image" text,
    "title" VARCHAR (50),
    "map_meter" integer default 0 NOT NULL,
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
);

create table starter(
    "id" serial primary key,
    "mini_asphalt" text,
    "car_width" integer default 0 NOT NULL,
    "car_heigth" integer default 0 NOT NULL,
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
);