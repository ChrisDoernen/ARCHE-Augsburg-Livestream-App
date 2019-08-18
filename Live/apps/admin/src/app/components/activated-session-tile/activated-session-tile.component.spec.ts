import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedSessionTileComponent } from "./activated-session-tile.component";
import { SessionService } from "../../services/session/session.service";
import createMockInstance from "jest-create-mock-instance";

describe("ActivatedSessionTileComponent", () => {
  let component: ActivatedSessionTileComponent;
  let fixture: ComponentFixture<ActivatedSessionTileComponent>;
  let sessionService: jest.Mocked<SessionService>;

  beforeEach(() => {
    sessionService = createMockInstance(SessionService);

    TestBed.configureTestingModule({
      declarations: [ActivatedSessionTileComponent],
      providers: [
        { provide: SessionService, useValue: sessionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivatedSessionTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});