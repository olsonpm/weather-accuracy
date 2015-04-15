--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

--
-- Data for Name: weather_data; Type: TABLE DATA; Schema: public; Owner: phil
--

COPY weather_data (weather_data_id, weather_data_type_id, weather_data_source_id, weather_data_date_id, weather_data_location_id) FROM stdin;
1	5	1	6	1
3	3	1	3	2
4	2	1	2	2
11	6	1	7	2
15	4	1	4	3
16	5	1	6	3
20	4	2	4	1
25	3	2	3	2
30	1	2	1	2
31	2	2	2	3
35	6	2	7	3
40	6	3	7	1
41	4	3	4	1
43	2	3	2	2
47	6	3	7	2
49	2	3	2	3
53	6	3	7	3
2	6	1	7	1
5	4	1	4	2
6	4	1	4	1
7	5	1	6	2
8	1	1	1	1
9	3	1	3	1
10	2	1	2	1
12	1	1	1	2
13	2	1	2	3
14	3	1	3	3
17	6	1	7	3
18	1	1	1	3
19	2	2	2	1
21	3	2	3	1
22	5	2	6	1
23	6	2	7	1
24	1	2	1	1
26	2	2	2	2
27	4	2	4	2
28	6	2	7	2
29	5	2	6	2
32	3	2	3	3
33	4	2	4	3
34	5	2	6	3
36	1	2	1	3
37	3	3	3	1
38	5	3	6	1
39	2	3	2	1
42	1	3	1	1
44	3	3	3	2
45	4	3	4	2
46	5	3	6	2
48	1	3	1	2
50	3	3	3	3
51	4	3	4	3
52	5	3	6	3
54	1	3	1	3
\.


--
-- Name: weather_data_weather_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: phil
--

SELECT pg_catalog.setval('weather_data_weather_data_id_seq', 54, true);


--
-- PostgreSQL database dump complete
--

