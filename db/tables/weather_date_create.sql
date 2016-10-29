--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.4
-- Dumped by pg_dump version 9.5.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: weather_date; Type: TABLE; Schema: public; Owner: phil
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
-- Name: weather_date_id; Type: DEFAULT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_date ALTER COLUMN weather_date_id SET DEFAULT nextval('weather_date_weather_date_id_seq'::regclass);


--
-- Name: weather_date_pkey; Type: CONSTRAINT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_date
    ADD CONSTRAINT weather_date_pkey PRIMARY KEY (weather_date_id);


--
-- Name: weather_date_value_key; Type: CONSTRAINT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_date
    ADD CONSTRAINT weather_date_value_key UNIQUE (weather_date_value);


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
-- PostgreSQL database dump complete
--

