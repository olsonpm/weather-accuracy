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
-- Name: weather_location; Type: TABLE; Schema: public; Owner: phil
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
-- Name: weather_location_id; Type: DEFAULT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_location ALTER COLUMN weather_location_id SET DEFAULT nextval('weather_location_weather_location_id_seq'::regclass);


--
-- Name: weather_location_latitude_longitude_key; Type: CONSTRAINT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_location
    ADD CONSTRAINT weather_location_latitude_longitude_key UNIQUE (weather_location_latitude, weather_location_longitude);


--
-- Name: weather_location_pkey; Type: CONSTRAINT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_location
    ADD CONSTRAINT weather_location_pkey PRIMARY KEY (weather_location_id);


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
-- PostgreSQL database dump complete
--

