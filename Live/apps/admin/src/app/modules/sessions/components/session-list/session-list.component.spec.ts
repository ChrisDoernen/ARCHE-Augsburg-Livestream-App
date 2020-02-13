import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EndpointService, Logger } from "@live/services";
import createMockInstance from "jest-create-mock-instance";
import { SessionService } from "../../../../services/session/session.service";
import { AngularMaterialModule } from "../../../angular-material/angular-material.module";
import { TitleBarComponent } from "../../../shared/components/title-bar/title-bar.component";
import { SessionListComponent } from "./session-list.component";

describe("SessionListComponent", () => {
  let component: SessionListComponent;
  let fixture: ComponentFixture<SessionListComponent>;
  let endpointService: jest.Mocked<EndpointService>;
  let sessionService: jest.Mocked<SessionService>;

  beforeEach(() => {
    endpointService = createMockInstance(EndpointService);
    sessionService = createMockInstance(SessionService);
    sessionService.getSessions.mockResolvedValue([]);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AngularMaterialModule
      ],
      declarations: [
        SessionListComponent,
        TitleBarComponent
      ],
      providers: [
        { provide: EndpointService, useValue: endpointService },
        { provide: Logger, useValue: jest.fn() },
        { provide: SessionService, useValue: sessionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SessionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
