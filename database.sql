
create table users(
    "id" serial primary key,
    "position_id" integer NOT NULL,
    "patronymic" VARCHAR(50) not null,
    "surname" VARCHAR(50) not null,
    "username" VARCHAR(50) not null,
    "phone" VARCHAR(50) not null,
    "email" VARCHAR(50) not null,
    "inn" VARCHAR(50),
    "bonus" integer default 0 not null,
    "skitka" integer default 1 not null,
    "recvizit" VARCHAR(50),
    "document_mashina" text,
    "prava" text,
    "fomo" text,
    "login" VARCHAR(100) NOT NULL,
    "password" VARCHAR(100) not null,
    UNIQUE(email),
    UNIQUE(phone),
    UNIQUE(inn),
    "time_create" timestamp  default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
);
create table work(
    "id" serial primary key,
    "type" VARCHAR(50) NOT NULL,
    "organizatsiya" VARCHAR(100) not null,
    "phone" VARCHAR(50) not null,
    "email" VARCHAR(50) not null,
    "inn" VARCHAR(50),
    "liso_contact" VARCHAR(50),
    "sayt" VARCHAR(50),
    "mashina" integer,
    "shving" integer,
    "time_create" timestamp  default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
);
create table aksiya(
        "id" serial primary key,
        "title" VARCHAR (50) NOT NULL,
        "image" text,
        "description" text,
        "stazgrt_day" date,
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

    create table homeiy(
        "id" serial primary key,
        "image" text,
        "title" VARCHAR(50),
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
        "title" VARCHAR(50),
        "description" text,
        "time_create" timestamp default current_timestamp not null,
        "time_update" timestamp default current_timestamp not null
    );    
create table position (
    "id" serial primary key,
    "position_name" VARCHAR(50),
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

create table filial(
 "id" serial primary key,
 "latitude" integer not null,
 "title" VARCHAR(50) NOT null,
 "image" text,
 "longitude" integer not null,
 "time_create" timestamp default current_timestamp not null,
 "time_update" timestamp default current_timestamp not null     
)
create table marka(
        "id" serial primary key,
        "title" VARCHAR (50),
        "time_create" timestamp default current_timestamp not null,
        "time_update" timestamp default current_timestamp not null
    );
    create table sovuqlik(
        "id" serial primary key,
        "sena" integer not null,
        "gradus" integer not null,
        "time_create" timestamp default current_timestamp not null,
        "time_update" timestamp default current_timestamp not null
    );
    create table product(
        "id" serial primary key,
        "description" text,
        "s3_sena" integer NOT NULL,
        "s4_sena" integer NOT NULL,
        "marka" integer NOT NULL,
        "category" integer NOT NULL,
        "hydrophobic_additive_sena" integer NOT NULL,
        "fiber_fiber" integer NOT NULL, 
        "homiy_id" integer NOT NULL,
        "time_create" timestamp default current_timestamp NOT NULL,
        "time_update" timestamp default current_timestamp NOT NULL
    );
    create table tarif(
        "id" serial primary key,
        "image" text Not null,
        "title" VARCHAR (50) not null,
        "sena_city" integer not null,
        "sena_out_city" integer default 0 NOT NULL,
        "time_create" timestamp default current_timestamp not null,
        "time_update" timestamp default current_timestamp not null
    );


create table mashina (
    "id" serial primary key,
    "image" text,
    "m3" integer not null,
    "sena" VARCHAR (50) ,
    "description" text,
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
);
create table shving (
    "id" serial primary key,
    "image" text,
    "m" integer not null,
    "sena" VARCHAR (50) ,
    "description" text,
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
);
create table sena(
   "id" serial primary key,  
    "usluga" integer not null,
    "suv_bilan" integer not null,
    "pustoy_smena" integer not null,
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
)


create table zakaz(
    "id" serial primary key,
 "address" VARCHAR(100) not null,
 "day" date not null,
 "time" time not null,
 "category" VARCHAR(50) not null,
 "positsiya" VARCHAR(50) not null,
 "m3" integer not null,
 "description" text,
 "payment" VARCHAR(50) not null,
 "tarif" VARCHAR(50) not null,
 "mashina" integer not null,
 "work_time_shving" VARCHAR(50) not null,
 "price" integer not null,
 "status" VARCHAR(50) default 0 not null,
 "shving" VARCHAR (50) not null,
 "marka" integer not null,
 "bonus" integer not null,
  "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null
)