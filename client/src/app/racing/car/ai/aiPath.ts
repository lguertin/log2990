import { WaypointCollection } from "../../track/waypoint/waypointCollection";
import { AiWaypoint } from "../../track/waypoint/aiWaypoint";
import { Waypoint } from "../../track/waypoint/waypoint";
import { Vector3 } from "three";
import { VERTICAL_AXIS } from "../../constants";
import { MathUtils } from "../../utils/math-utils";
import { SteeringAdjustment,
         MAX_AI_SPEED,
         MAX_ADJUSTMENT_DISTANCE_FROM_TURN,
         MAX_LATERAL_DISPLACEMENT_ANGLE_BEFORE_TURN,
         MIN_LATERAL_DISPLACEMENT_ANGLE_BEFORE_TURN,
         MAX_LATERAL_ADJUSTMENT_BEFORE_TURN,
         MAX_LATERAL_DISPLACEMENT_ANGLE_AT_TURN,
         MIN_LATERAL_DISPLACEMENT_ANGLE_AT_TURN,
         MAX_LATERAL_ADJUSTMENT_AT_TURN,
         MIN_AI_SPEED,
         MIN_ANGLE,
         MAX_SLOW_DOWN_TURN_ANGLE,
         ADJUSTMENT_DISTANCE_FACTOR,
         MAX_DISTANCE_WITH_DISPLACEMENT_ATTENUATION } from "./constants";

export class AiPath {
    private _waypointCollection: WaypointCollection<AiWaypoint>;

    private static toAiWaypoint(waypoint: Waypoint): AiWaypoint {
        return new AiWaypoint(waypoint.position, MAX_AI_SPEED);
    }

    public constructor(trackWaypointCollection: WaypointCollection<Waypoint>) {
        this._waypointCollection = new WaypointCollection<AiWaypoint>();
        this.cloneTrackWaypoints(trackWaypointCollection);
    }

    public get firstWaypointToFollow(): AiWaypoint {
        return this._waypointCollection.firstWaypoint.next;
    }

    public tuneTurningPaths(): void {
        for (const waypoint of this.waypointCollectionArray) {
            this.tuneWaypoint(waypoint);
        }
    }

    private cloneTrackWaypoints(trackWaypointCollection: WaypointCollection<Waypoint>): void {
        let waypointIndex: number = 0;
        trackWaypointCollection.waypoints.forEach((waypoint) => {
            if (waypointIndex !== trackWaypointCollection.numberOfWaypoints - 1) {
                this._waypointCollection.add(AiPath.toAiWaypoint(waypoint));
            }
            waypointIndex++;
        });
        this._waypointCollection.linkLoop();
    }

    private get waypointCollectionArray(): AiWaypoint[] {
        const initialTrackWaypoints: AiWaypoint[] = new Array<AiWaypoint>();
        this._waypointCollection.waypoints.forEach((waypoint) => {
            initialTrackWaypoints.push(waypoint);
        });

        return initialTrackWaypoints;
    }

    private tuneWaypoint(waypoint: AiWaypoint): void {
        this._waypointCollection.addBefore(this.getBeforeTurnWaypoint(waypoint), waypoint);

        waypoint.previous.lateralDisplacement = this.getBeforeTurnLateralDisplacement(waypoint);
        waypoint.lateralDisplacement = this.getTurnLateralDisplacement(waypoint);
        waypoint.speed = this.calculateOptimalTurnSpeed(waypoint);
    }

    private getBeforeTurnWaypoint(waypoint: AiWaypoint): AiWaypoint {
        return new AiWaypoint(this.getBeforeTurnWaypointPosition(waypoint),
                              this.getBeforeTurnOptimalSpeed(waypoint));
    }

    private getBeforeTurnOptimalSpeed(waypoint: AiWaypoint): number {
        return this.getAdjustmentDistanceFromTurn(waypoint) * MAX_AI_SPEED / MAX_ADJUSTMENT_DISTANCE_FROM_TURN;
    }

    private getBeforeTurnWaypointPosition(waypoint: AiWaypoint): Vector3 {
        return waypoint.position.clone().add(this.getBeforeTurnRelativePosition(waypoint));
    }

    private getBeforeTurnRelativePosition(waypoint: AiWaypoint): Vector3 {
        return waypoint.vectorToPrevious.setLength(this.getAdjustmentDistanceFromTurn(waypoint));
    }

    private getWaypointAdjustmentDistanceFromTurn(waypoint: Waypoint): number {
        return waypoint.distanceToPrevious * ADJUSTMENT_DISTANCE_FACTOR;
    }

    private getAdjustmentDistanceFromTurn(waypoint: AiWaypoint): number {
        return Math.min(MAX_ADJUSTMENT_DISTANCE_FROM_TURN,
                        this.getWaypointAdjustmentDistanceFromTurn(waypoint));
    }

    private getAdjustmentDistanceFromTurnWithAttenuation(waypoint: AiWaypoint): number {
        return this.getAdjustmentDistanceFromTurn(waypoint) / MAX_DISTANCE_WITH_DISPLACEMENT_ATTENUATION;
    }

    private getBeforeTurnLateralDisplacement(waypoint: AiWaypoint): Vector3 {
        switch (waypoint.getTurnSide()) {
            case SteeringAdjustment.Left:
                return this.getBeforeTurnDisplacementVector(waypoint);
            case SteeringAdjustment.Right:
                return this.getBeforeTurnDisplacementVector(waypoint).negate();
            case SteeringAdjustment.None:
                return new Vector3(0, 0, 0);
            default:
                throw new Error("SteeringAdjustment error: no case scenario have been set for " + waypoint.getTurnSide().toString);
        }
    }

    private getBeforeTurnDisplacementVector(waypoint: AiWaypoint): Vector3 {
        return waypoint.position.clone()
                                .sub(waypoint.previous.position)
                                .cross(VERTICAL_AXIS)
                                .setLength(this.getBeforeTurnLateralDisplacementLength(waypoint));
    }

    private getTurnLateralDisplacement(waypoint: AiWaypoint): Vector3 {
        return waypoint.bisectrixUnitVector.setLength(this.getTurnLateralDisplacementLength(waypoint));
    }

    private getMinimalDisplacementAngleBeforeTurn(waypoint: AiWaypoint): number {
        return Math.max(waypoint.waypointAngle(), MIN_LATERAL_DISPLACEMENT_ANGLE_BEFORE_TURN);
    }

    private getScopeOfLateralDisplacement(waypoint: AiWaypoint): number {
        return MAX_LATERAL_DISPLACEMENT_ANGLE_BEFORE_TURN - this.getMinimalDisplacementAngleBeforeTurn(waypoint);
    }

    private getScopeOfLateralDisplacementWithAdjustments(waypoint: AiWaypoint): number {
        return  this.getScopeOfLateralDisplacement(waypoint)
            *   MAX_LATERAL_ADJUSTMENT_BEFORE_TURN
            /   MIN_LATERAL_DISPLACEMENT_ANGLE_BEFORE_TURN;
    }

    private getBeforeTurnLateralDisplacementLength(waypoint: AiWaypoint): number {
        return  this.getScopeOfLateralDisplacementWithAdjustments(waypoint)
            *   this.getAdjustmentDistanceFromTurnWithAttenuation(waypoint);
    }

    private getBoundedWaypointAngle(waypoint: AiWaypoint): number {
        return MathUtils.boundValue(   MIN_LATERAL_DISPLACEMENT_ANGLE_AT_TURN,
                                       MAX_LATERAL_DISPLACEMENT_ANGLE_AT_TURN,
                                       waypoint.waypointAngle());
    }

    private getScopeOfLateralDisplacementAngleAtTurn(waypoint: AiWaypoint): number {
        return MAX_LATERAL_DISPLACEMENT_ANGLE_AT_TURN - this.getBoundedWaypointAngle(waypoint);
    }

    private getScopeOfLateralDisplacementAngleAtTurnWithAdjustments(waypoint: AiWaypoint): number {
        return this.getScopeOfLateralDisplacementAngleAtTurn(waypoint) * MAX_LATERAL_ADJUSTMENT_AT_TURN;
    }

    private get scopeOfLateralDisplacementAngleAtTurn(): number {
        return MAX_LATERAL_DISPLACEMENT_ANGLE_AT_TURN - MIN_LATERAL_DISPLACEMENT_ANGLE_AT_TURN;
    }

    private getTurnLateralDisplacementLength(waypoint: AiWaypoint): number {
        return this.getScopeOfLateralDisplacementAngleAtTurnWithAdjustments(waypoint)
            /  this.scopeOfLateralDisplacementAngleAtTurn;
    }

    private getSpeedTurnFactor(waypoint: AiWaypoint): number {
        return (waypoint.waypointAngle() - MIN_ANGLE) / MAX_SLOW_DOWN_TURN_ANGLE ;
    }

    private calculateOptimalTurnSpeed(waypoint: AiWaypoint): number {
        return MathUtils.interpolate(MIN_AI_SPEED, MAX_AI_SPEED, this.getSpeedTurnFactor(waypoint));
    }
}
