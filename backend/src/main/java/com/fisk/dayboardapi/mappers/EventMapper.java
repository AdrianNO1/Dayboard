package com.fisk.dayboardapi.mappers;

import com.fisk.dayboardapi.models.Event;
import com.fisk.dayboardapi.models.EventDto;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface EventMapper {
	Event toEvent(EventDto eventDto);
}
