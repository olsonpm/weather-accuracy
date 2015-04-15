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
-- Name: weather_data_id; Type: DEFAULT; Schema: public; Owner: phil
--

ALTER TABLE ONLY weather_data ALTER COLUMN weather_data_id SET DEFAULT nextval('weather_data_weather_data_id_seq'::regclass);


--
-- Name: weather_data_pkey; Type: CONSTRAINT; Schema: public; Owner: phil; Tablespace: 
--

ALTER TABLE ONLY weather_data
    ADD CONSTRAINT weather_data_pkey PRIMARY KEY (weather_data_id);


--
-- Name: weather_data_type_source_date_location_key; Type: CONSTRAINT; Schema: public; Owner: phil; Tablespace: 
--

ALTER TABLE ONLY weather_data
    ADD CONSTRAINT weather_data_type_source_date_location_key UNIQUE (weather_data_type_id, weather_data_source_id, weather_data_date_id, weather_data_location_id);


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
-- Name: weather_data; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON TABLE weather_data FROM PUBLIC;
REVOKE ALL ON TABLE weather_data FROM phil;
GRANT ALL ON TABLE weather_data TO phil;
GRANT ALL ON TABLE weather_data TO weather_accuracy;


--
-- Name: weather_data_weather_data_id_seq; Type: ACL; Schema: public; Owner: phil
--

REVOKE ALL ON SEQUENCE weather_data_weather_data_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE weather_data_weather_data_id_seq FROM phil;
GRANT ALL ON SEQUENCE weather_data_weather_data_id_seq TO phil;
GRANT SELECT ON SEQUENCE weather_data_weather_data_id_seq TO schemaspy;
GRANT ALL ON SEQUENCE weather_data_weather_data_id_seq TO weather_accuracy;


--
-- PostgreSQL database dump complete
--
