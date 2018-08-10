import { Component, OnInit } from '@angular/core';
import { LiveStream } from '../../entities/live-stream.entity';
import { StreamsService } from '../../services/streams-service.service';

@Component({
  selector: 'select-streams',
  templateUrl: './select-streams.component.html',
  styleUrls: ['./select-streams.component.css']
})
export class SelectStreamsComponent implements OnInit {

  title = 'Verfügbare Streams';
  availableLiveSteams: LiveStream[];

  constructor(private streamsService: StreamsService) {
  }

  ngOnInit() {
    this.getAvailableLiveStreams();
  }
  
  private getAvailableLiveStreams() {
    this.streamsService.getAvailableLiveStreams()
    .subscribe((streams) => {
      this.availableLiveSteams = streams;
    })
  }
}
