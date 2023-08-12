create table aksiya(
    "id" serial primary key,
    "title" VARCHAR (50) NOT NULL,
    "image" VARCHAR (50),
    "description" VARCHAR (50),
    "start_day" date,
    "end_day" date,
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null

);
create table news(
    "id" serial primary key,
    "title" VARCHAR (50),
    "description" VARCHAR (50),
    "image" VARCHAR (50),
    "min_description" text,
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
);
create table compony(
    "id" serial primary key,
    "logo"text,
    "phone" VARCHAR (50),
    "telegram" VARCHAR (50),
    "email" VARCHAR (50) NOT NULL,
    "whatsapp" VARCHAR (50),
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp NOT NULL
);
create table homeiy(
    "id" serial primary key,
    "image" VARCHAR (50),
    "link" VARCHAR (50) NOT NULL,
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null

);
create table skachat_pridlachenu(
    "id" serial primary key,
    "image" VARCHAR (50),
    "title" VARCHAR (50) ,
    "deskription" VARCHAR (50),
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
);
create table preferences (
    "id" serial primary key,
    "image" VARCHAR (50),
    "title" VARCHAR (50) ,
    "description" VARCHAR (50),
    "liso" VARCHAR  (1),
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
    
);
create table category(
    "id" serial primary key,
    "image" VARCHAR (50),
    "title" VARCHAR (50) ,
    "description" VARCHAR (50),
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
);
create table product(
    "id" serial primary key,
    "description" VARCHAR (50),
    "sena" integer default 0 NOT NULL,
    "marka" text,
    "stay" text,
    "liquid" text,
    "storage" text,
    "against"text,
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
);
create table tarif(
    "id" serial primary key,
    "image" VARCHAR (50),
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