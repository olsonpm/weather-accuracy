insert into weather_data_point_name (weather_data_point_name_value, weather_data_point_name_unit_id)
values ('high_temperature', ( select wdpu.weather_data_point_unit_id from weather_data_point_unit wdpu where wdpu.weather_data_point_unit_name = 'celsius' ))
	, ('low_temperature', ( select wdpu.weather_data_point_unit_id from weather_data_point_unit wdpu where wdpu.weather_data_point_unit_name = 'celsius' ))
	, ('mean_wind_speed', ( select wdpu.weather_data_point_unit_id from weather_data_point_unit wdpu where wdpu.weather_data_point_unit_name = 'kilometers_per_hour' ));
