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

SET default_tablespace = '';

SET default_with_oids = false;

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
-- Name: weather_source_id; Type: DEFAULT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_source ALTER COLUMN weather_source_id SET DEFAULT nextval('weather_source_weather_source_id_seq'::regclass);


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
-- PostgreSQL database dump complete
--

