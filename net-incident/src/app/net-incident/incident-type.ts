// ===========================================================================
// File: Incident-Type.ts
// Author: Phil Huhn
// Created Date: 2017-12-08
// 2017-12-13 Added more templates
// 2018-03-30 Changed FromCompany to FromServer
//
export interface IIncidentType {
	IncidentTypeId: number;
	IncidentTypeShortDesc: string;
	IncidentTypeDesc: string;
	IncidentTypeFromServer: boolean;
	IncidentTypeSubjectLine: string;
	IncidentTypeEmailTemplate: string;
	IncidentTypeTimeTemplate: string;
	IncidentTypeThanksTemplate: string;
	IncidentTypeLogTemplate: string;
	IncidentTypeTemplate: string;
	//
	toString(): string;
	//
}
//
export class IncidentType implements IIncidentType {
	//
	// using short-hand declaration...
	constructor(
		public IncidentTypeId: number,
		public IncidentTypeShortDesc: string,
		public IncidentTypeDesc: string,
		public IncidentTypeFromServer: boolean,
		public IncidentTypeSubjectLine: string,
		public IncidentTypeEmailTemplate: string,
		public IncidentTypeTimeTemplate: string,
		public IncidentTypeThanksTemplate: string,
		public IncidentTypeLogTemplate: string,
		public IncidentTypeTemplate: string
	) { }
	/*
	** toString implementation for class Incident
	*/
	public toString = (): string => {
		return JSON.stringify( this );
	}
	//
}
// ===========================================================================
