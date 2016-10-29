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
-- Name: weather_data_point; Type: TABLE; Schema: public; Owner: phil
--

CREATE TABLE weather_data_point (
    weather_data_point_id bigint NOT NULL,
    weather_data_point_data_id bigint NOT NULL,
    weather_data_point_value text NOT NULL,
    weather_data_point_name_id bigint NOT NULL
);


ALTER TABLE weather_data_point OWNER TO phil;

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
-- Name: weather_data_point_id; Type: DEFAULT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data_point ALTER COLUMN weather_data_point_id SET DEFAULT nextval('weather_data_point_weather_data_point_id_seq'::regclass);


--
-- Name: weather_data_id_point_name_key; Type: CONSTRAINT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data_point
    ADD CONSTRAINT weather_data_id_point_name_key UNIQUE (weather_data_point_data_id, weather_data_point_name_id);


--
-- Name: weather_data_point_pkey; Type: CONSTRAINT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data_point
    ADD CONSTRAINT weather_data_point_pkey PRIMARY KEY (weather_data_point_id);


--
-- Name: weather_data_point_weather_data_point_data_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data_point
    ADD CONSTRAINT weather_data_point_weather_data_point_data_id_fkey FOREIGN KEY (weather_data_point_data_id) REFERENCES weather_data(weather_data_id);


--
-- Name: weather_data_point; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON TABLE weather_data_point FROM PUBLIC;
REVOKE ALL ON TABLE weather_data_point FROM phil;
GRANT ALL ON TABLE weather_data_point TO phil;
GRANT ALL ON TABLE weather_data_point TO weather_accuracy;


--
-- Name: weather_data_point_weather_data_point_id_seq; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON SEQUENCE weather_data_point_weather_data_point_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE weather_data_point_weather_data_point_id_seq FROM phil;
GRANT ALL ON SEQUENCE weather_data_point_weather_data_point_id_seq TO phil;
GRANT SELECT ON SEQUENCE weather_data_point_weather_data_point_id_seq TO schemaspy;
GRANT ALL ON SEQUENCE weather_data_point_weather_data_point_id_seq TO weather_accuracy;


--
-- PostgreSQL database dump complete
--

