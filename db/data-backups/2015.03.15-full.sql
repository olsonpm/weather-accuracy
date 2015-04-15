--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: weather_data; Type: TABLE; Schema: public; Owner: phil; Tablespace: 
--

CREATE TABLE weather_data (
    weather_data_id bigint NOT NULL,
    weather_data_type_id bigint NOT NULL,
    weather_data_source_id bigint NOT NULL,
    weather_data_date_id bigint NOT NULL,
    weather_data_location_id bigint NOT NULL
);


ALTER TABLE weather_data OWNER TO phil;

--
-- Name: weather_data_point; Type: TABLE; Schema: public; Owner: phil; Tablespace: 
--

CREATE TABLE weather_data_point (
    weather_data_point_id bigint NOT NULL,
    weather_data_point_data_id bigint NOT NULL,
    weather_data_point_value text NOT NULL,
    weather_data_point_name_id bigint NOT NULL
);


ALTER TABLE weather_data_point OWNER TO phil;

--
-- Name: weather_data_point_name; Type: TABLE; Schema: public; Owner: phil; Tablespace: 
--

CREATE TABLE weather_data_point_name (
    weather_data_point_name_id bigint NOT NULL,
    weather_data_point_name_value text,
    weather_data_point_name_unit_id bigint NOT NULL
);


ALTER TABLE weather_data_point_name OWNER TO phil;

--
-- Name: weather_data_point_name_weather_data_point_name_id_seq; Type: SEQUENCE; Schema: public; Owner: phil
--

CREATE SEQUENCE weather_data_point_name_weather_data_point_name_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE weather_data_point_name_weather_data_point_name_id_seq OWNER TO phil;

--
-- Name: weather_data_point_name_weather_data_point_name_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: phil
--

ALTER SEQUENCE weather_data_point_name_weather_data_point_name_id_seq OWNED BY weather_data_point_name.weather_data_point_name_id;


--
-- Name: weather_data_point_unit; Type: TABLE; Schema: public; Owner: phil; Tablespace: 
--

CREATE TABLE weather_data_point_unit (
    weather_data_point_unit_id bigint NOT NULL,
    weather_data_point_unit_name text NOT NULL
);


ALTER TABLE weather_data_point_unit OWNER TO phil;

--
-- Name: weather_data_point_unit_weather_data_point_unit_id_seq; Type: SEQUENCE; Schema: public; Owner: phil
--

CREATE SEQUENCE weather_data_point_unit_weather_data_point_unit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE weather_data_point_unit_weather_data_point_unit_id_seq OWNER TO phil;

--
-- Name: weather_data_point_unit_weather_data_point_unit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: phil
--

ALTER SEQUENCE weather_data_point_unit_weather_data_point_unit_id_seq OWNED BY weather_data_point_unit.weather_data_point_unit_id;


--
-- Name: weather_data_point_weather_data_point_id_seq; Type: SEQUENCE; Schema: public; Owner: phil
--

CREATE SEQUENCE weather_data_point_weather_data_point_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE weather_data_point_weather_data_point_id_seq OWNER TO phil;

--
-- Name: weather_data_point_weather_data_point_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: phil
--

ALTER SEQUENCE weather_data_point_weather_data_point_id_seq OWNED BY weather_data_point.weather_data_point_id;


--
-- Name: weather_data_type; Type: TABLE; Schema: public; Owner: phil; Tablespace: 
--

CREATE TABLE weather_data_type (
    weather_data_type_id bigint NOT NULL,
    weather_data_type_name text NOT NULL
);


ALTER TABLE weather_data_type OWNER TO phil;

--
-- Name: weather_data_type_weather_data_type_id_seq; Type: SEQUENCE; Schema: public; Owner: phil
--

CREATE SEQUENCE weather_data_type_weather_data_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE weather_data_type_weather_data_type_id_seq OWNER TO phil;

--
-- Name: weather_data_type_weather_data_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: phil
--

ALTER SEQUENCE weather_data_type_weather_data_type_id_seq OWNED BY weather_data_type.weather_data_type_id;


--
-- Name: weather_data_weather_data_id_seq; Type: SEQUENCE; Schema: public; Owner: phil
--

CREATE SEQUENCE weather_data_weather_data_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE weather_data_weather_data_id_seq OWNER TO phil;

--
-- Name: weather_data_weather_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: phil
--

ALTER SEQUENCE weather_data_weather_data_id_seq OWNED BY weather_data.weather_data_id;


--
-- Name: weather_date; Type: TABLE; Schema: public; Owner: phil; Tablespace: 
--

CREATE TABLE weather_date (
    weather_date_id bigint NOT NULL,
    weather_date_value date NOT NULL
);


ALTER TABLE weather_date OWNER TO phil;

--
-- Name: weather_date_weather_date_id_seq; Type: SEQUENCE; Schema: public; Owner: phil
--

CREATE SEQUENCE weather_date_weather_date_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE weather_date_weather_date_id_seq OWNER TO phil;

--
-- Name: weather_date_weather_date_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: phil
--

ALTER SEQUENCE weather_date_weather_date_id_seq OWNED BY weather_date.weather_date_id;


--
-- Name: weather_location; Type: TABLE; Schema: public; Owner: phil; Tablespace: 
--

CREATE TABLE weather_location (
    weather_location_id bigint NOT NULL,
    weather_location_latitude numeric(10,6) NOT NULL,
    weather_location_longitude numeric(10,6) NOT NULL,
    weather_location_name text NOT NULL,
    weather_location_tz text NOT NULL
);


ALTER TABLE weather_location OWNER TO phil;

--
-- Name: weather_location_weather_location_id_seq; Type: SEQUENCE; Schema: public; Owner: phil
--

CREATE SEQUENCE weather_location_weather_location_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE weather_location_weather_location_id_seq OWNER TO phil;

--
-- Name: weather_location_weather_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: phil
--

ALTER SEQUENCE weather_location_weather_location_id_seq OWNED BY weather_location.weather_location_id;


--
-- Name: weather_source; Type: TABLE; Schema: public; Owner: phil; Tablespace: 
--

CREATE TABLE weather_source (
    weather_source_id bigint NOT NULL,
    weather_source_name text NOT NULL
);


ALTER TABLE weather_source OWNER TO phil;

--
-- Name: weather_source_weather_source_id_seq; Type: SEQUENCE; Schema: public; Owner: phil
--

CREATE SEQUENCE weather_source_weather_source_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE weather_source_weather_source_id_seq OWNER TO phil;

--
-- Name: weather_source_weather_source_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: phil
--

ALTER SEQUENCE weather_source_weather_source_id_seq OWNED BY weather_source.weather_source_id;


--
-- Name: weather_data_id; Type: DEFAULT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data ALTER COLUMN weather_data_id SET DEFAULT nextval('weather_data_weather_data_id_seq'::regclass);


--
-- Name: weather_data_point_id; Type: DEFAULT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data_point ALTER COLUMN weather_data_point_id SET DEFAULT nextval('weather_data_point_weather_data_point_id_seq'::regclass);


--
-- Name: weather_data_point_name_id; Type: DEFAULT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data_point_name ALTER COLUMN weather_data_point_name_id SET DEFAULT nextval('weather_data_point_name_weather_data_point_name_id_seq'::regclass);


--
-- Name: weather_data_point_unit_id; Type: DEFAULT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data_point_unit ALTER COLUMN weather_data_point_unit_id SET DEFAULT nextval('weather_data_point_unit_weather_data_point_unit_id_seq'::regclass);


--
-- Name: weather_data_type_id; Type: DEFAULT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data_type ALTER COLUMN weather_data_type_id SET DEFAULT nextval('weather_data_type_weather_data_type_id_seq'::regclass);


--
-- Name: weather_date_id; Type: DEFAULT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_date ALTER COLUMN weather_date_id SET DEFAULT nextval('weather_date_weather_date_id_seq'::regclass);


--
-- Name: weather_location_id; Type: DEFAULT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_location ALTER COLUMN weather_location_id SET DEFAULT nextval('weather_location_weather_location_id_seq'::regclass);


--
-- Name: weather_source_id; Type: DEFAULT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_source ALTER COLUMN weather_source_id SET DEFAULT nextval('weather_source_weather_source_id_seq'::regclass);


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
-- Data for Name: weather_data_point; Type: TABLE DATA; Schema: public; Owner: phil
--

COPY weather_data_point (weather_data_point_id, weather_data_point_data_id, weather_data_point_value, weather_data_point_name_id) FROM stdin;
1	8	27	1
4	10	12	2
5	8	11	2
2	8	8	3
6	9	22	1
7	10	13	3
3	10	22	1
8	9	11	2
9	6	22	1
10	9	19	3
11	6	11	2
12	1	23	1
13	6	19	3
14	2	21	1
15	1	11	2
16	1	19	3
17	2	11	2
18	2	16	3
19	4	22	1
20	4	12	2
21	4	13	3
22	3	22	1
23	3	11	2
24	3	19	3
25	5	22	1
26	5	11	2
27	5	19	3
28	7	23	1
29	7	11	2
30	7	19	3
31	11	21	1
32	11	11	2
33	11	16	3
34	18	27	1
35	18	8	3
36	18	11	2
37	12	27	1
38	12	11	2
39	12	8	3
40	13	22	1
41	13	12	2
42	13	13	3
43	14	22	1
44	14	11	2
45	14	19	3
46	15	11	2
47	15	19	3
48	15	22	1
49	16	23	1
50	16	11	2
51	16	19	3
52	17	21	1
53	17	11	2
54	17	16	3
55	19	20	1
56	19	12	2
57	19	6	3
58	21	20	1
59	21	11	2
60	21	8	3
61	20	20	1
62	20	11	2
63	20	10	3
64	22	20	1
65	22	11	2
66	22	12	3
67	23	19	1
68	23	11	2
69	23	14	3
70	24	26	1
71	24	12	2
72	24	7.3	3
73	26	20	1
74	26	12	2
75	26	6	3
76	25	20	1
77	25	11	2
78	25	8	3
79	27	20	1
80	27	11	2
81	27	10	3
82	29	20	1
83	29	11	2
84	29	12	3
85	28	19	1
86	28	11	2
87	28	14	3
88	30	26	1
89	30	12	2
90	30	7.3	3
91	36	26	1
92	36	12	2
93	36	7.3	3
94	39	17.91	1
95	39	12.26	2
96	39	6.44	3
97	37	19.66	1
98	37	9.98	2
99	37	10.53	3
100	41	17.89	1
101	41	10.3	2
102	41	11.72	3
103	38	20.41	1
104	38	9.31	2
105	38	6.47	3
106	40	18.06	1
107	40	9.87	2
108	40	8.05	3
109	31	20	1
110	31	12	2
111	31	6	3
112	32	20	1
113	32	11	2
114	32	8	3
115	33	20	1
116	33	11	2
117	33	10	3
118	34	20	1
119	34	11	2
120	34	12	3
121	35	19	1
122	35	11	2
123	35	14	3
124	42	23.45	1
125	42	13.1	2
126	42	0.89	3
127	43	17.91	1
128	43	12.26	2
129	43	6.44	3
130	44	19.66	1
131	44	9.98	2
132	44	10.53	3
133	45	17.89	1
134	45	10.3	2
135	45	11.72	3
136	46	20.41	1
138	46	6.47	3
145	49	17.91	1
156	52	6.47	3
137	46	9.31	2
149	50	9.98	2
159	53	8.05	3
139	47	18.06	1
146	49	6.44	3
155	52	9.31	2
140	47	9.87	2
150	50	10.53	3
160	54	23.45	1
141	47	8.05	3
151	51	17.89	1
142	48	23.45	1
152	51	10.3	2
161	54	13.1	2
143	48	13.1	2
154	52	20.41	1
162	54	0.89	3
144	48	0.89	3
153	51	11.72	3
147	49	12.26	2
157	53	18.06	1
148	50	19.66	1
158	53	9.87	2
\.


--
-- Data for Name: weather_data_point_name; Type: TABLE DATA; Schema: public; Owner: phil
--

COPY weather_data_point_name (weather_data_point_name_id, weather_data_point_name_value, weather_data_point_name_unit_id) FROM stdin;
1	high_temperature	1
2	low_temperature	1
3	mean_wind_speed	2
\.


--
-- Name: weather_data_point_name_weather_data_point_name_id_seq; Type: SEQUENCE SET; Schema: public; Owner: phil
--

SELECT pg_catalog.setval('weather_data_point_name_weather_data_point_name_id_seq', 3, true);


--
-- Data for Name: weather_data_point_unit; Type: TABLE DATA; Schema: public; Owner: phil
--

COPY weather_data_point_unit (weather_data_point_unit_id, weather_data_point_unit_name) FROM stdin;
1	celsius
2	kilometers_per_hour
\.


--
-- Name: weather_data_point_unit_weather_data_point_unit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: phil
--

SELECT pg_catalog.setval('weather_data_point_unit_weather_data_point_unit_id_seq', 2, true);


--
-- Name: weather_data_point_weather_data_point_id_seq; Type: SEQUENCE SET; Schema: public; Owner: phil
--

SELECT pg_catalog.setval('weather_data_point_weather_data_point_id_seq', 162, true);


--
-- Data for Name: weather_data_type; Type: TABLE DATA; Schema: public; Owner: phil
--

COPY weather_data_type (weather_data_type_id, weather_data_type_name) FROM stdin;
1	actual
2	forecast_1_day_out
3	forecast_2_days_out
4	forecast_3_days_out
5	forecast_4_days_out
6	forecast_5_days_out
\.


--
-- Name: weather_data_type_weather_data_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: phil
--

SELECT pg_catalog.setval('weather_data_type_weather_data_type_id_seq', 6, true);


--
-- Name: weather_data_weather_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: phil
--

SELECT pg_catalog.setval('weather_data_weather_data_id_seq', 54, true);


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
-- Data for Name: weather_location; Type: TABLE DATA; Schema: public; Owner: phil
--

COPY weather_location (weather_location_id, weather_location_latitude, weather_location_longitude, weather_location_name, weather_location_tz) FROM stdin;
1	37.935758	-122.347749	Richmond, CA	America/Los_Angeles
2	41.878114	-87.629798	Chicago, IL	America/Chicago
3	40.712784	-74.005941	New York, NY	America/New_York
\.


--
-- Name: weather_location_weather_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: phil
--

SELECT pg_catalog.setval('weather_location_weather_location_id_seq', 3, true);


--
-- Data for Name: weather_source; Type: TABLE DATA; Schema: public; Owner: phil
--

COPY weather_source (weather_source_id, weather_source_name) FROM stdin;
1	weather_underground
2	ham_weather
3	forecast_io
\.


--
-- Name: weather_source_weather_source_id_seq; Type: SEQUENCE SET; Schema: public; Owner: phil
--

SELECT pg_catalog.setval('weather_source_weather_source_id_seq', 3, true);


--
-- Name: weather_data_id_point_name_key; Type: CONSTRAINT; Schema: public; Owner: phil; Tablespace: 
--

ALTER TABLE ONLY weather_data_point
    ADD CONSTRAINT weather_data_id_point_name_key UNIQUE (weather_data_point_data_id, weather_data_point_name_id);


--
-- Name: weather_data_pkey; Type: CONSTRAINT; Schema: public; Owner: phil; Tablespace: 
--

ALTER TABLE ONLY weather_data
    ADD CONSTRAINT weather_data_pkey PRIMARY KEY (weather_data_id);


--
-- Name: weather_data_point_name_pkey; Type: CONSTRAINT; Schema: public; Owner: phil; Tablespace: 
--

ALTER TABLE ONLY weather_data_point_name
    ADD CONSTRAINT weather_data_point_name_pkey PRIMARY KEY (weather_data_point_name_id);


--
-- Name: weather_data_point_name_weather_data_point_name_value_key; Type: CONSTRAINT; Schema: public; Owner: phil; Tablespace: 
--

ALTER TABLE ONLY weather_data_point_name
    ADD CONSTRAINT weather_data_point_name_weather_data_point_name_value_key UNIQUE (weather_data_point_name_value);


--
-- Name: weather_data_point_pkey; Type: CONSTRAINT; Schema: public; Owner: phil; Tablespace: 
--

ALTER TABLE ONLY weather_data_point
    ADD CONSTRAINT weather_data_point_pkey PRIMARY KEY (weather_data_point_id);


--
-- Name: weather_data_point_unit_name_key; Type: CONSTRAINT; Schema: public; Owner: phil; Tablespace: 
--

ALTER TABLE ONLY weather_data_point_unit
    ADD CONSTRAINT weather_data_point_unit_name_key UNIQUE (weather_data_point_unit_name);


--
-- Name: weather_data_point_unit_pkey; Type: CONSTRAINT; Schema: public; Owner: phil; Tablespace: 
--

ALTER TABLE ONLY weather_data_point_unit
    ADD CONSTRAINT weather_data_point_unit_pkey PRIMARY KEY (weather_data_point_unit_id);


--
-- Name: weather_data_type_name_key; Type: CONSTRAINT; Schema: public; Owner: phil; Tablespace: 
--

ALTER TABLE ONLY weather_data_type
    ADD CONSTRAINT weather_data_type_name_key UNIQUE (weather_data_type_name);


--
-- Name: weather_data_type_pkey; Type: CONSTRAINT; Schema: public; Owner: phil; Tablespace: 
--

ALTER TABLE ONLY weather_data_type
    ADD CONSTRAINT weather_data_type_pkey PRIMARY KEY (weather_data_type_id);


--
-- Name: weather_data_type_source_date_location_key; Type: CONSTRAINT; Schema: public; Owner: phil; Tablespace: 
--

ALTER TABLE ONLY weather_data
    ADD CONSTRAINT weather_data_type_source_date_location_key UNIQUE (weather_data_type_id, weather_data_source_id, weather_data_date_id, weather_data_location_id);


--
-- Name: weather_date_pkey; Type: CONSTRAINT; Schema: public; Owner: phil; Tablespace: 
--

ALTER TABLE ONLY weather_date
    ADD CONSTRAINT weather_date_pkey PRIMARY KEY (weather_date_id);


--
-- Name: weather_date_value_key; Type: CONSTRAINT; Schema: public; Owner: phil; Tablespace: 
--

ALTER TABLE ONLY weather_date
    ADD CONSTRAINT weather_date_value_key UNIQUE (weather_date_value);


--
-- Name: weather_location_latitude_longitude_key; Type: CONSTRAINT; Schema: public; Owner: phil; Tablespace: 
--

ALTER TABLE ONLY weather_location
    ADD CONSTRAINT weather_location_latitude_longitude_key UNIQUE (weather_location_latitude, weather_location_longitude);


--
-- Name: weather_location_pkey; Type: CONSTRAINT; Schema: public; Owner: phil; Tablespace: 
--

ALTER TABLE ONLY weather_location
    ADD CONSTRAINT weather_location_pkey PRIMARY KEY (weather_location_id);


--
-- Name: weather_source_name_key; Type: CONSTRAINT; Schema: public; Owner: phil; Tablespace: 
--

ALTER TABLE ONLY weather_source
    ADD CONSTRAINT weather_source_name_key UNIQUE (weather_source_name);


--
-- Name: weather_source_pkey; Type: CONSTRAINT; Schema: public; Owner: phil; Tablespace: 
--

ALTER TABLE ONLY weather_source
    ADD CONSTRAINT weather_source_pkey PRIMARY KEY (weather_source_id);


--
-- Name: weather_data_point_name_weather_data_point_name_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data_point_name
    ADD CONSTRAINT weather_data_point_name_weather_data_point_name_unit_id_fkey FOREIGN KEY (weather_data_point_name_unit_id) REFERENCES weather_data_point_unit(weather_data_point_unit_id);


--
-- Name: weather_data_point_weather_data_point_data_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data_point
    ADD CONSTRAINT weather_data_point_weather_data_point_data_id_fkey FOREIGN KEY (weather_data_point_data_id) REFERENCES weather_data(weather_data_id);


--
-- Name: weather_data_point_weather_data_point_name_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data_point
    ADD CONSTRAINT weather_data_point_weather_data_point_name_id_fkey FOREIGN KEY (weather_data_point_name_id) REFERENCES weather_data_point_name(weather_data_point_name_id);


--
-- Name: weather_data_weather_data_date_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data
    ADD CONSTRAINT weather_data_weather_data_date_id_fkey FOREIGN KEY (weather_data_date_id) REFERENCES weather_date(weather_date_id);


--
-- Name: weather_data_weather_data_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data
    ADD CONSTRAINT weather_data_weather_data_location_id_fkey FOREIGN KEY (weather_data_location_id) REFERENCES weather_location(weather_location_id);


--
-- Name: weather_data_weather_data_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data
    ADD CONSTRAINT weather_data_weather_data_source_id_fkey FOREIGN KEY (weather_data_source_id) REFERENCES weather_source(weather_source_id);


--
-- Name: weather_data_weather_data_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data
    ADD CONSTRAINT weather_data_weather_data_type_id_fkey FOREIGN KEY (weather_data_type_id) REFERENCES weather_data_type(weather_data_type_id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- Name: weather_data; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON TABLE weather_data FROM PUBLIC;
REVOKE ALL ON TABLE weather_data FROM phil;
GRANT ALL ON TABLE weather_data TO phil;
GRANT ALL ON TABLE weather_data TO weather_accuracy;


--
-- Name: weather_data_point; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON TABLE weather_data_point FROM PUBLIC;
REVOKE ALL ON TABLE weather_data_point FROM phil;
GRANT ALL ON TABLE weather_data_point TO phil;
GRANT ALL ON TABLE weather_data_point TO weather_accuracy;


--
-- Name: weather_data_point_name; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON TABLE weather_data_point_name FROM PUBLIC;
REVOKE ALL ON TABLE weather_data_point_name FROM phil;
GRANT ALL ON TABLE weather_data_point_name TO phil;
GRANT ALL ON TABLE weather_data_point_name TO weather_accuracy;


--
-- Name: weather_data_point_name_weather_data_point_name_id_seq; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON SEQUENCE weather_data_point_name_weather_data_point_name_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE weather_data_point_name_weather_data_point_name_id_seq FROM phil;
GRANT ALL ON SEQUENCE weather_data_point_name_weather_data_point_name_id_seq TO phil;
GRANT ALL ON SEQUENCE weather_data_point_name_weather_data_point_name_id_seq TO weather_accuracy;


--
-- Name: weather_data_point_unit; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON TABLE weather_data_point_unit FROM PUBLIC;
REVOKE ALL ON TABLE weather_data_point_unit FROM phil;
GRANT ALL ON TABLE weather_data_point_unit TO phil;
GRANT ALL ON TABLE weather_data_point_unit TO weather_accuracy;


--
-- Name: weather_data_point_unit_weather_data_point_unit_id_seq; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON SEQUENCE weather_data_point_unit_weather_data_point_unit_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE weather_data_point_unit_weather_data_point_unit_id_seq FROM phil;
GRANT ALL ON SEQUENCE weather_data_point_unit_weather_data_point_unit_id_seq TO phil;
GRANT SELECT ON SEQUENCE weather_data_point_unit_weather_data_point_unit_id_seq TO schemaspy;
GRANT ALL ON SEQUENCE weather_data_point_unit_weather_data_point_unit_id_seq TO weather_accuracy;


--
-- Name: weather_data_point_weather_data_point_id_seq; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON SEQUENCE weather_data_point_weather_data_point_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE weather_data_point_weather_data_point_id_seq FROM phil;
GRANT ALL ON SEQUENCE weather_data_point_weather_data_point_id_seq TO phil;
GRANT SELECT ON SEQUENCE weather_data_point_weather_data_point_id_seq TO schemaspy;
GRANT ALL ON SEQUENCE weather_data_point_weather_data_point_id_seq TO weather_accuracy;


--
-- Name: weather_data_type; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON TABLE weather_data_type FROM PUBLIC;
REVOKE ALL ON TABLE weather_data_type FROM phil;
GRANT ALL ON TABLE weather_data_type TO phil;
GRANT ALL ON TABLE weather_data_type TO weather_accuracy;


--
-- Name: weather_data_type_weather_data_type_id_seq; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON SEQUENCE weather_data_type_weather_data_type_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE weather_data_type_weather_data_type_id_seq FROM phil;
GRANT ALL ON SEQUENCE weather_data_type_weather_data_type_id_seq TO phil;
GRANT SELECT ON SEQUENCE weather_data_type_weather_data_type_id_seq TO schemaspy;
GRANT ALL ON SEQUENCE weather_data_type_weather_data_type_id_seq TO weather_accuracy;


--
-- Name: weather_data_weather_data_id_seq; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON SEQUENCE weather_data_weather_data_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE weather_data_weather_data_id_seq FROM phil;
GRANT ALL ON SEQUENCE weather_data_weather_data_id_seq TO phil;
GRANT SELECT ON SEQUENCE weather_data_weather_data_id_seq TO schemaspy;
GRANT ALL ON SEQUENCE weather_data_weather_data_id_seq TO weather_accuracy;


--
-- Name: weather_date; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON TABLE weather_date FROM PUBLIC;
REVOKE ALL ON TABLE weather_date FROM phil;
GRANT ALL ON TABLE weather_date TO phil;
GRANT ALL ON TABLE weather_date TO weather_accuracy;


--
-- Name: weather_date_weather_date_id_seq; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON SEQUENCE weather_date_weather_date_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE weather_date_weather_date_id_seq FROM phil;
GRANT ALL ON SEQUENCE weather_date_weather_date_id_seq TO phil;
GRANT SELECT ON SEQUENCE weather_date_weather_date_id_seq TO schemaspy;
GRANT ALL ON SEQUENCE weather_date_weather_date_id_seq TO weather_accuracy;


--
-- Name: weather_location; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON TABLE weather_location FROM PUBLIC;
REVOKE ALL ON TABLE weather_location FROM phil;
GRANT ALL ON TABLE weather_location TO phil;
GRANT ALL ON TABLE weather_location TO weather_accuracy;


--
-- Name: weather_location_weather_location_id_seq; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON SEQUENCE weather_location_weather_location_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE weather_location_weather_location_id_seq FROM phil;
GRANT ALL ON SEQUENCE weather_location_weather_location_id_seq TO phil;
GRANT ALL ON SEQUENCE weather_location_weather_location_id_seq TO weather_accuracy;


--
-- Name: weather_source; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON TABLE weather_source FROM PUBLIC;
REVOKE ALL ON TABLE weather_source FROM phil;
GRANT ALL ON TABLE weather_source TO phil;
GRANT ALL ON TABLE weather_source TO weather_accuracy;


--
-- Name: weather_source_weather_source_id_seq; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON SEQUENCE weather_source_weather_source_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE weather_source_weather_source_id_seq FROM phil;
GRANT ALL ON SEQUENCE weather_source_weather_source_id_seq TO phil;
GRANT SELECT ON SEQUENCE weather_source_weather_source_id_seq TO schemaspy;
GRANT ALL ON SEQUENCE weather_source_weather_source_id_seq TO weather_accuracy;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: phil
--

ALTER DEFAULT PRIVILEGES FOR ROLE phil IN SCHEMA public REVOKE ALL ON SEQUENCES  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE phil IN SCHEMA public REVOKE ALL ON SEQUENCES  FROM phil;
ALTER DEFAULT PRIVILEGES FOR ROLE phil IN SCHEMA public GRANT ALL ON SEQUENCES  TO weather_accuracy;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: phil
--

ALTER DEFAULT PRIVILEGES FOR ROLE phil IN SCHEMA public REVOKE ALL ON TABLES  FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE phil IN SCHEMA public REVOKE ALL ON TABLES  FROM phil;
ALTER DEFAULT PRIVILEGES FOR ROLE phil IN SCHEMA public GRANT ALL ON TABLES  TO weather_accuracy;


--
-- PostgreSQL database dump complete
--

