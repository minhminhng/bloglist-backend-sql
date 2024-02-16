\d
CREATE TABLE blogs (
id SERIAL PRIMARY KEY,
author text,
url text NOT null,
title text NOT null,
likes int DEFAULT 0);
\d blogs

insert into blogs (author, url, title) values ('Linh Trang', 'http://www.savourydays.com', 'Savoury Days');
insert into blogs (author, url, title) values ('Michael Chan', 'https://reactpatterns.com', 'React Patterns');
select * from blogs;