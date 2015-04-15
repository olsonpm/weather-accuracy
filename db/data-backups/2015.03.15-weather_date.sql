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
-- Data for Name: weather_date; Type: TABLE DATA; Schema: public; Owner: phil
--

COPY weather_date (weather_date_id, weather_date_value) FROM stdin;
1	2015-03-14
2	2015-03-16
3	2015-03-17
4	2015-03-18
5	2015-03-21
6	2015-03-19
7	2015-03-20
\.


--
-- Name: weather_date_weather_date_id_seq; Type: SEQUENCE SET; Schema: public; Owner: phil
--

SELECT pg_catalog.setval('weather_date_weather_date_id_seq', 7, true);


--
-- PostgreSQL database dump complete
--

