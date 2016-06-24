--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.3
-- Dumped by pg_dump version 9.5.3

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
-- Name: weather_data_point_name; Type: TABLE; Schema: public; Owner: phil
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
-- Name: weather_data_point_name_id; Type: DEFAULT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data_point_name ALTER COLUMN weather_data_point_name_id SET DEFAULT nextval('weather_data_point_name_weather_data_point_name_id_seq'::regclass);


--
-- Name: weather_data_point_name_pkey; Type: CONSTRAINT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data_point_name
    ADD CONSTRAINT weather_data_point_name_pkey PRIMARY KEY (weather_data_point_name_id);


--
-- Name: weather_data_point_name_weather_data_point_name_value_key; Type: CONSTRAINT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data_point_name
    ADD CONSTRAINT weather_data_point_name_weather_data_point_name_value_key UNIQUE (weather_data_point_name_value);


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
-- PostgreSQL database dump complete
--

