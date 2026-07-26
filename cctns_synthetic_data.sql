-- ==========================================================================
-- KARNATAKA STATE POLICE — CCTNS REALISTIC SYNTHETIC DATABASE SCHEMA & DATA
-- Generated based on Official KSP CCTNS Entity Relationship Diagram (ERD)
-- ==========================================================================

-- 0. DROP TABLES (for clean re-runs)
DROP TABLE IF EXISTS ArrestSurrender CASCADE;
DROP TABLE IF EXISTS ActSectionAssociation CASCADE;
DROP TABLE IF EXISTS CrimeHeadActSection CASCADE;
DROP TABLE IF EXISTS ChargesheetDetails CASCADE;
DROP TABLE IF EXISTS ComplainantDetails CASCADE;
DROP TABLE IF EXISTS Victim CASCADE;
DROP TABLE IF EXISTS Accused CASCADE;
DROP TABLE IF EXISTS CaseMaster CASCADE;
DROP TABLE IF EXISTS Section CASCADE;
DROP TABLE IF EXISTS Act CASCADE;
DROP TABLE IF EXISTS CasteMaster CASCADE;
DROP TABLE IF EXISTS ReligionMaster CASCADE;
DROP TABLE IF EXISTS OccupationMaster CASCADE;
DROP TABLE IF EXISTS Court CASCADE;
DROP TABLE IF EXISTS CaseStatusMaster CASCADE;
DROP TABLE IF EXISTS CrimeSubHead CASCADE;
DROP TABLE IF EXISTS CrimeHead CASCADE;
DROP TABLE IF EXISTS GravityOffence CASCADE;
DROP TABLE IF EXISTS CaseCategory CASCADE;
DROP TABLE IF EXISTS Employee CASCADE;
DROP TABLE IF EXISTS Designation CASCADE;
DROP TABLE IF EXISTS Rank CASCADE;
DROP TABLE IF EXISTS Unit CASCADE;
DROP TABLE IF EXISTS UnitType CASCADE;
DROP TABLE IF EXISTS District CASCADE;
DROP TABLE IF EXISTS State CASCADE;

-- 1. CREATE MASTER & LOOKUP TABLES
CREATE TABLE State (
    StateID INT PRIMARY KEY,
    StateName VARCHAR(100),
    NationalityID INT,
    Active BIT
);
CREATE TABLE District (
    DistrictID INT PRIMARY KEY,
    DistrictName VARCHAR(100),
    StateID INT REFERENCES State(StateID),
    Active BIT
);
CREATE TABLE UnitType (
    UnitTypeID INT PRIMARY KEY,
    UnitTypeName VARCHAR(100),
    CityDistState VARCHAR(50),
    Hierarchy INT,
    Active BIT
);
CREATE TABLE Unit (
    UnitID INT PRIMARY KEY,
    UnitName VARCHAR(150),
    TypeID INT REFERENCES UnitType(UnitTypeID),
    ParentUnit INT,
    NationalityID INT,
    StateID INT REFERENCES State(StateID),
    DistrictID INT REFERENCES District(DistrictID),
    Active BIT
);
-- Fix #5: Create missing Rank and Designation master tables
CREATE TABLE Rank (
    RankID INT PRIMARY KEY,
    RankName VARCHAR(100),
    Hierarchy INT,
    Active BIT
);
CREATE TABLE Designation (
    DesignationID INT PRIMARY KEY,
    DesignationName VARCHAR(100),
    Active BIT,
    SortOrder INT
);
-- Fix #5: Employee table with proper FK references to Rank and Designation
CREATE TABLE Employee (
    EmployeeID INT PRIMARY KEY,
    DistrictID INT REFERENCES District(DistrictID),
    UnitID INT REFERENCES Unit(UnitID),
    RankID INT REFERENCES Rank(RankID),
    DesignationID INT REFERENCES Designation(DesignationID),
    KGID VARCHAR(50),
    FirstName VARCHAR(100),
    EmployeeDOB DATE,
    GenderID INT,
    BloodGroupID INT,
    PhysicallyChallenged BIT,
    AppointmentDate DATE
);
CREATE TABLE CaseCategory (
    CaseCategoryID INT PRIMARY KEY,
    LookupValue VARCHAR(50)
);
CREATE TABLE GravityOffence (
    GravityOffenceID INT PRIMARY KEY,
    LookupValue VARCHAR(50)
);
CREATE TABLE CrimeHead (
    CrimeHeadID INT PRIMARY KEY,
    CrimeGroupName VARCHAR(100),
    Active BIT
);
CREATE TABLE CrimeSubHead (
    CrimeSubHeadID INT PRIMARY KEY,
    CrimeHeadID INT REFERENCES CrimeHead(CrimeHeadID),
    CrimeHeadName VARCHAR(100),
    SeqID INT
);
CREATE TABLE CaseStatusMaster (
    CaseStatusID INT PRIMARY KEY,
    CaseStatusName VARCHAR(100)
);
CREATE TABLE Court (
    CourtID INT PRIMARY KEY,
    CourtName VARCHAR(150),
    DistrictID INT REFERENCES District(DistrictID),
    StateID INT REFERENCES State(StateID),
    Active BIT
);
CREATE TABLE OccupationMaster (
    OccupationID INT PRIMARY KEY,
    OccupationName VARCHAR(100)
);
CREATE TABLE ReligionMaster (
    ReligionID INT PRIMARY KEY,
    ReligionName VARCHAR(100)
);
CREATE TABLE CasteMaster (
    caste_master_id INT PRIMARY KEY,
    caste_master_name VARCHAR(100)
);
-- Fix #1: ActCode and SectionCode as VARCHAR(50) to support letter suffixes like '498A', '120B'
CREATE TABLE Act (
    ActCode VARCHAR(50) PRIMARY KEY,
    ActDescription VARCHAR(255),
    ShortName VARCHAR(50),
    Active BIT
);
CREATE TABLE Section (
    SectionCode VARCHAR(50) PRIMARY KEY,
    ActCode VARCHAR(50) REFERENCES Act(ActCode),
    SectionDescription VARCHAR(255),
    Active BIT
);
-- Fix #4: Create missing CrimeHeadActSection table
CREATE TABLE CrimeHeadActSection (
    CrimeHeadID INT REFERENCES CrimeHead(CrimeHeadID),
    ActCode VARCHAR(50) REFERENCES Act(ActCode),
    SectionCode VARCHAR(50) REFERENCES Section(SectionCode),
    PRIMARY KEY (CrimeHeadID, ActCode, SectionCode)
);

-- ==========================================================================
-- 2. CREATE CORE TRANSACTIONS TABLES (PER CCTNS ERD)
-- ==========================================================================
-- Fix #6: Note on ERD Ambiguities for Hackathon Organizers Confirmation:
-- 1. Inv_OccuranceTime vs inline CaseMaster fields: Whether incident date/time
--    and location coordinates belong inline in CaseMaster or in a separate
--    Inv_OccuranceTime table is ambiguous in the source ERD. Implemented inline here.
-- 2. ArrestSurrender-Accused direct FK vs junction table: Whether ArrestSurrender
--    links to Accused via direct FK (AccusedMasterID) or via a junction table is
--    ambiguous in the source ERD. Implemented via direct FK here.
-- These points should be confirmed with hackathon organizers before final submission.
-- ==========================================================================
-- Fix #2: Add missing fields IncidentFromDate, IncidentToDate, InfoReceivedPSDate, latitude, longitude, BriefFacts
CREATE TABLE CaseMaster (
    CaseMasterID INT PRIMARY KEY,
    CrimeNo VARCHAR(30) UNIQUE NOT NULL,
    CaseNo VARCHAR(20) NOT NULL,
    CrimeRegisteredDate DATE NOT NULL,
    PolicePersonID INT REFERENCES Employee(EmployeeID),
    PoliceStationID INT REFERENCES Unit(UnitID),
    CaseCategoryID INT REFERENCES CaseCategory(CaseCategoryID),
    GravityOffenceID INT REFERENCES GravityOffence(GravityOffenceID),
    CrimeMajorHeadID INT REFERENCES CrimeHead(CrimeHeadID),
    CrimeMinorHeadID INT REFERENCES CrimeSubHead(CrimeSubHeadID),
    CaseStatusID INT REFERENCES CaseStatusMaster(CaseStatusID),
    CourtID INT REFERENCES Court(CourtID),
    IncidentFromDate TIMESTAMP,
    IncidentToDate TIMESTAMP,
    InfoReceivedPSDate TIMESTAMP,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    BriefFacts TEXT
);
CREATE TABLE Accused (
    AccusedMasterID INT PRIMARY KEY,
    CaseMasterID INT REFERENCES CaseMaster(CaseMasterID),
    AccusedName VARCHAR(150) NOT NULL,
    AgeYear INT,
    GenderID INT,
    PersonID VARCHAR(10)
);
CREATE TABLE Victim (
    VictimMasterID INT PRIMARY KEY,
    CaseMasterID INT REFERENCES CaseMaster(CaseMasterID),
    VictimName VARCHAR(150) NOT NULL,
    AgeYear INT,
    GenderID INT,
    VictimPolice VARCHAR(1)
);
CREATE TABLE ComplainantDetails (
    ComplainantID INT PRIMARY KEY,
    CaseMasterID INT REFERENCES CaseMaster(CaseMasterID),
    ComplainantName VARCHAR(150) NOT NULL,
    AgeYear INT,
    OccupationID INT REFERENCES OccupationMaster(OccupationID),
    ReligionID INT REFERENCES ReligionMaster(ReligionID),
    CasteID INT REFERENCES CasteMaster(caste_master_id),
    GenderID INT
);
-- Fix #1: ActSectionAssociation referencing VARCHAR ActID and SectionID
CREATE TABLE ActSectionAssociation (
    CaseMasterID INT REFERENCES CaseMaster(CaseMasterID),
    ActID VARCHAR(50) REFERENCES Act(ActCode),
    SectionID VARCHAR(50) REFERENCES Section(SectionCode),
    ActOrderID INT,
    SectionOrderID INT,
    PRIMARY KEY (CaseMasterID, ActID, SectionID)
);
CREATE TABLE ArrestSurrender (
    ArrestSurrenderID INT PRIMARY KEY,
    CaseMasterID INT REFERENCES CaseMaster(CaseMasterID),
    ArrestSurrenderTypeID INT,
    ArrestSurrenderDate DATE,
    ArrestSurrenderStateId INT REFERENCES State(StateID),
    ArrestSurrenderDistrictId INT REFERENCES District(DistrictID),
    PoliceStationID INT REFERENCES Unit(UnitID),
    IOID INT REFERENCES Employee(EmployeeID),
    CourtID INT REFERENCES Court(CourtID),
    AccusedMasterID INT REFERENCES Accused(AccusedMasterID),
    IsAccused BIT,
    IsComplainantAccused BIT
);
-- Fix #3: Create missing ChargesheetDetails table
CREATE TABLE ChargesheetDetails (
    CSID INT PRIMARY KEY,
    CaseMasterID INT REFERENCES CaseMaster(CaseMasterID),
    csdate DATE,
    cstype CHAR(1), -- A=Chargesheet / B=False Case / C=Undetected
    PolicePersonID INT REFERENCES Employee(EmployeeID)
);

-- ==========================================================================
-- 3. SEED LOOKUP / MASTER REFERENCE DATA
-- ==========================================================================
INSERT INTO State VALUES (29, 'Karnataka', 1, '1');
INSERT INTO District VALUES (1001, 'Bengaluru Urban', 29, '1'), (1002, 'Mysuru', 29, '1'), (1003, 'Mangaluru City', 29, '1'), (1004, 'Hubballi-Dharwad', 29, '1'), (1005, 'Belagavi', 29, '1');
INSERT INTO UnitType VALUES (1, 'Police Station', 'District', 5, '1');
INSERT INTO Unit VALUES
  (2001, 'Ashok Nagar PS', 1, NULL, 1, 29, 1001, '1'),
  (2002, 'Indiranagar PS', 1, NULL, 1, 29, 1001, '1'),
  (2003, 'Devaraja PS', 1, NULL, 1, 29, 1002, '1'),
  (2004, 'Kadri PS', 1, NULL, 1, 29, 1003, '1'),
  (2005, 'Suburban PS Hubballi', 1, NULL, 1, 29, 1004, '1');
-- Fix #5: Seed Rank table with realistic Karnataka Police ranks
INSERT INTO Rank VALUES
  (1, 'Constable (PC)', 1, '1'),
  (2, 'Head Constable (HC)', 2, '1'),
  (3, 'Assistant Sub-Inspector (ASI)', 3, '1'),
  (4, 'Sub-Inspector (PSI)', 4, '1'),
  (5, 'Police Inspector (PI)', 5, '1'),
  (6, 'Deputy Superintendent of Police (DSP)', 6, '1'),
  (7, 'Superintendent of Police (SP)', 7, '1'),
  (8, 'Deputy Inspector General (DIG)', 8, '1');
-- Fix #5: Seed Designation table with realistic designations
INSERT INTO Designation VALUES
  (1, 'Investigating Officer (IO)', '1', 1),
  (2, 'Station House Officer (SHO)', '1', 2),
  (3, 'Patrol Officer', '1', 3),
  (4, 'Crime Reader', '1', 4),
  (5, 'Sub-Divisional Officer', '1', 5);
INSERT INTO Employee VALUES
  (101, 1001, 2001, 5, 1, 'KGID-88210', 'Inspector Vikram Patil', '1982-05-14', 1, 1, '0', '2008-07-01'),
  (102, 1001, 2002, 5, 1, 'KGID-77312', 'Inspector Ramesh Gowda', '1984-09-22', 1, 2, '0', '2010-04-15'),
  (103, 1002, 2003, 5, 1, 'KGID-66415', 'Inspector Anitha Hegde', '1986-11-03', 2, 1, '0', '2012-08-11'),
  (104, 1003, 2004, 5, 1, 'KGID-55109', 'Inspector Suresh Shetty', '1980-03-19', 1, 1, '0', '2006-01-20'),
  (105, 1004, 2005, 5, 1, 'KGID-44918', 'Inspector Basavaraj Hiremath', '1983-07-28', 1, 1, '0', '2009-10-05');
INSERT INTO CaseCategory VALUES (1, 'FIR'), (3, 'UDR'), (4, 'PAR'), (8, 'Zero FIR');
INSERT INTO GravityOffence VALUES (1, 'Heinous'), (2, 'Non-Heinous');
INSERT INTO CrimeHead VALUES (1, 'Crimes Against Body', '1'), (2, 'Crimes Against Property', '1'), (3, 'Economic Offences', '1');
INSERT INTO CrimeSubHead VALUES (101, 1, 'Murder', 1), (102, 1, 'Attempt to Murder', 2), (103, 1, 'Rape', 3), (104, 1, 'Dowry Harassment', 4), (201, 2, 'Theft / Snatching', 1), (301, 3, 'Cheating / Fraud', 1);
INSERT INTO CaseStatusMaster VALUES (1, 'Under Investigation'), (2, 'Charge Sheeted'), (3, 'Closed / Final Report');
INSERT INTO Court VALUES
  (3001, '1st ACMM Court Bengaluru', 1001, 29, '1'),
  (3002, '4th ACMM Court Bengaluru', 1001, 29, '1'),
  (3003, 'Principal JMFC Court Mysuru', 1002, 29, '1'),
  (3004, 'District & Sessions Court Mangaluru', 1003, 29, '1'),
  (3005, 'JMFC Court Hubballi', 1004, 29, '1');
INSERT INTO OccupationMaster VALUES (1, 'Business'), (2, 'Software Engineer'), (3, 'Farmer / Agriculture'), (4, 'Government Employee'), (5, 'Student'), (6, 'Daily Wage Worker');
INSERT INTO ReligionMaster VALUES (1, 'Hindu'), (2, 'Muslim'), (3, 'Christian'), (4, 'Jain');
INSERT INTO CasteMaster VALUES (1, 'General'), (2, 'OBC - Vokkaliga'), (3, 'OBC - Lingayat'), (4, 'OBC - Kuruba'), (5, 'SC/ST');
-- Fix #1: Seed Act and Section with VARCHAR codes including letter suffixes '498A', '120B', '354A', '376D', '489A'
INSERT INTO Act VALUES ('1', 'Indian Penal Code, 1860', 'IPC', '1');
INSERT INTO Section VALUES
  ('120B', '1', 'Punishment of criminal conspiracy', '1'),
  ('302', '1', 'Murder - Punishment for murder', '1'),
  ('307', '1', 'Attempt to murder', '1'),
  ('354A', '1', 'Sexual harassment and punishment for sexual harassment', '1'),
  ('376', '1', 'Punishment for rape', '1'),
  ('376D', '1', 'Gang rape', '1'),
  ('379', '1', 'Punishment for theft', '1'),
  ('420', '1', 'Cheating and dishonestly inducing delivery of property', '1'),
  ('489A', '1', 'Counterfeiting currency-notes or bank-notes', '1'),
  ('498A', '1', 'Husband or relative of husband subjecting woman to cruelty (498A)', '1');
-- Fix #4: Seed CrimeHeadActSection with reasonable mappings
INSERT INTO CrimeHeadActSection VALUES
  (1, '1', '302'),
  (1, '1', '307'),
  (1, '1', '376'),
  (1, '1', '354A'),
  (1, '1', '376D'),
  (2, '1', '379'),
  (2, '1', '420'),
  (2, '1', '489A'),
  (3, '1', '498A'),
  (3, '1', '120B');

-- ==========================================================================
-- 4. INSERT 20 REALISTIC CaseMaster RECORDS (WITH BRIEFFACTS & COORDINATES)
-- Format: Category(1) + District(4) + Station(4) + Year(4) + Serial(5)
-- ==========================================================================
INSERT INTO CaseMaster (CaseMasterID, CrimeNo, CaseNo, CrimeRegisteredDate, PolicePersonID, PoliceStationID, CaseCategoryID, GravityOffenceID, CrimeMajorHeadID, CrimeMinorHeadID, CaseStatusID, CourtID, IncidentFromDate, IncidentToDate, InfoReceivedPSDate, latitude, longitude, BriefFacts) VALUES
  (1, '110012001202600001', '202600001', '2026-01-10', 101, 2001, 1, 1, 1, 101, 1, 3001, '2026-01-10 10:00:00', '2026-01-10 11:00:00', '2026-01-10 11:30:00', 12.97159870, 77.60956270, 'Homicide reported near Brigade Road, Ashok Nagar PS limit. Victim was attacked with a sharp weapon during a late-night altercation. Accused Manjunath Hiremath was apprehended from his residence. Weapon of offense recovered and IO initiated investigation under IPC Section 302.'),
  (2, '110012001202600002', '202600002', '2026-01-14', 101, 2001, 1, 1, 1, 102, 1, 3001, '2026-01-14 14:00:00', '2026-01-14 15:00:00', '2026-01-14 15:30:00', 12.97341200, 77.61120000, 'Attempted murder on MG Road under Ashok Nagar PS jurisdiction. Accused Shivakumar Kulkarni assaulted complainant with an iron rod over a commercial dispute. Complainant was admitted to Bowring Hospital with severe head injuries. IO registered FIR under IPC Section 307.'),
  (3, '110012001202600003', '202600003', '2026-01-22', 101, 2001, 1, 2, 2, 201, 2, 3001, '2026-01-22 18:00:00', '2026-01-22 18:30:00', '2026-01-22 19:00:00', 12.96980000, 77.60540000, 'Gold chain snatching and mobile phone theft near Richmond Circle, Ashok Nagar PS area. Two suspects on a motorcycle snatched a 30-gram gold chain from a pedestrian. Accused Karthik Shetty was arrested during vehicle checks. Charge sheet filed before 1st ACMM Court.'),
  (4, '110012001202600004', '202600004', '2026-02-05', 101, 2001, 1, 2, 3, 301, 1, 3001, '2026-02-05 11:00:00', '2026-02-05 12:00:00', '2026-02-05 12:30:00', 12.97210000, 77.60890000, 'Financial fraud and cheating of Rs. 25 lakhs via a fake foreign employment agency in Ashok Nagar. Accused Girish Rao collected advance payments from job seekers dishonestly. Documents seized during raid. Investigation under IPC Section 420.'),
  (5, '110012002202600001', '202600001', '2026-01-11', 102, 2002, 1, 1, 1, 101, 1, 3002, '2026-01-11 21:00:00', '2026-01-11 22:00:00', '2026-01-11 22:30:00', 12.97836920, 77.64083560, 'Murder of a senior citizen at a residential house on 100ft Road, Indiranagar PS. Accused Ramesh K broke into the house for robbery and fatally assaulted the victim. Blood-stained clothes and stolen ornaments recovered by KSP special team.'),
  (6, '110012002202600002', '202600002', '2026-01-18', 102, 2002, 1, 1, 1, 103, 1, 3002, '2026-01-18 16:00:00', '2026-01-18 17:00:00', '2026-01-18 17:30:00', 12.97910000, 77.64150000, 'Sexual assault reported in Indiranagar PS limit. Complainant alleged that accused Raghavendra S sexually assaulted her under false promise of marriage. Medical examination conducted and statements recorded under IPC Section 376.'),
  (7, '110012002202600003', '202600003', '2026-02-01', 102, 2002, 1, 2, 1, 104, 2, 3002, '2026-02-01 09:00:00', '2026-02-01 10:00:00', '2026-02-01 10:30:00', 12.98020000, 77.64210000, 'Cruelty and dowry harassment reported at Indiranagar PS. Complainant Sowmya Hegde alleged physical and mental harassment by husband Harish Naik demanding additional dowry of Rs. 10 lakhs. Charge sheet submitted under IPC Section 498A.'),
  (8, '110012002202600004', '202600004', '2026-02-19', 102, 2002, 1, 2, 2, 201, 1, 3002, '2026-02-19 13:00:00', '2026-02-19 14:00:00', '2026-02-19 14:30:00', 12.97750000, 77.63980000, 'Two-wheeler vehicle theft reported from CMH Road metro station parking lot, Indiranagar. CCTV footage revealed accused Darshan S using a duplicate key to unlock the scooter. Stolen vehicle recovered from Kolar.'),
  (9, '110022003202600001', '202600001', '2026-01-12', 103, 2003, 1, 1, 1, 102, 1, 3003, '2026-01-12 19:00:00', '2026-01-12 20:00:00', '2026-01-12 20:30:00', 12.30516300, 76.65536100, 'Attempt to murder during a street brawl near Sayyaji Rao Road, Devaraja PS, Mysuru. Accused Satish Kumar V attacked the victim with a dagger following a personal rivalry. Victim stabilized at KR Hospital. IPC Section 307.'),
  (10, '110022003202600002', '202600002', '2026-01-25', 103, 2003, 1, 2, 3, 301, 2, 3003, '2026-01-25 10:00:00', '2026-01-25 11:00:00', '2026-01-25 11:30:00', 12.30620000, 76.65610000, 'Real estate investment scam and cheating of Rs. 40 lakhs reported at Devaraja PS, Mysuru. Accused Pramod Muthalik forged land ownership documents and sold disputed plots. Charge sheet filed before Principal JMFC Court.'),
  (11, '110022003202600003', '202600003', '2026-02-08', 103, 2003, 1, 2, 2, 201, 1, 3003, '2026-02-08 15:00:00', '2026-02-08 16:00:00', '2026-02-08 16:30:00', 12.30450000, 76.65420000, 'Burglary and shoplifting of electronics worth Rs. 3 lakhs from a retail showroom in Devaraja PS limit, Mysuru. Accused Veeresh S was caught on surveillance cameras and arrested with stolen goods.'),
  (12, '110022003202600004', '202600004', '2026-02-21', 103, 2003, 1, 1, 1, 104, 1, 3003, '2026-02-21 08:00:00', '2026-02-21 09:00:00', '2026-02-21 09:30:00', 12.30710000, 76.65700000, 'Domestic abuse and dowry harassment under IPC Section 498A registered at Devaraja PS, Mysuru. Husband Nagesh Gowda and relatives subjected victim to cruelty over dowry demands.'),
  (13, '110032004202600001', '202600001', '2026-01-08', 104, 2004, 1, 1, 1, 101, 1, 3004, '2026-01-08 22:00:00', '2026-01-08 23:00:00', '2026-01-08 23:30:00', 12.88583000, 74.85603000, 'Fatal gang assault and murder near Kadri Park, Mangaluru City. Accused Prakash Acharya involved in clash between rival groups leading to the homicide of a local youth. IO collected forensic evidence under IPC Section 302.'),
  (14, '110032004202600002', '202600002', '2026-01-29', 104, 2004, 1, 2, 2, 201, 1, 3004, '2026-01-29 14:00:00', '2026-01-29 15:00:00', '2026-01-29 15:30:00', 12.88650000, 74.85710000, 'House break-in and theft of gold ornaments weighing 150 grams from a locked residence in Kadri PS area, Mangaluru. Accused Sunil Poojary arrested by city crime branch.'),
  (15, '110032004202600003', '202600003', '2026-02-14', 104, 2004, 1, 2, 3, 301, 2, 3004, '2026-02-14 11:00:00', '2026-02-14 12:00:00', '2026-02-14 12:30:00', 12.88490000, 74.85520000, 'Online cyber phishing and banking fraud cheating victim of Rs. 12 lakhs in Kadri PS limit, Mangaluru. Accused Mohammed Shafi operated fraudulent call center. Charge sheet filed under IPC Section 420.'),
  (16, '110032004202600004', '202600004', '2026-02-28', 104, 2004, 1, 1, 1, 102, 1, 3004, '2026-02-28 17:00:00', '2026-02-28 18:00:00', '2026-02-28 18:30:00', 12.88720000, 74.85800000, 'Attempt to murder reported at a commercial complex in Kadri PS area, Mangaluru. Accused Abdul Rehman fired two rounds from an unlicensed firearm over business rivalry.'),
  (17, '110042005202600001', '202600001', '2026-01-15', 105, 2005, 1, 1, 1, 101, 1, 3005, '2026-01-15 20:00:00', '2026-01-15 21:00:00', '2026-01-15 21:30:00', 15.36470800, 75.12395500, 'Murder of an agricultural market trader near Suburban PS limit, Hubballi. Accused Mallikarjun Kulkarni attacked the victim over a financial dispute regarding crop payments. IPC Section 302.'),
  (18, '110042005202600002', '202600002', '2026-02-02', 105, 2005, 1, 2, 2, 201, 1, 3005, '2026-02-02 12:00:00', '2026-02-02 13:00:00', '2026-02-02 13:30:00', 15.36550000, 75.12480000, 'Theft of agricultural equipment and copper cables worth Rs. 5 lakhs from a warehouse in Suburban PS limit, Hubballi. Accused Basavaraj Dharwad arrested.'),
  (19, '110042005202600003', '202600003', '2026-02-18', 105, 2005, 1, 1, 1, 103, 1, 3005, '2026-02-18 16:00:00', '2026-02-18 17:00:00', '2026-02-18 17:30:00', 15.36390000, 75.12310000, 'Sexual assault and intimidation reported in Suburban PS jurisdiction, Hubballi. Accused Santosh Kumar arrested by IO under IPC Section 376. Forensic samples sent to FSL.'),
  (20, '110042005202600004', '202600004', '2026-03-01', 105, 2005, 1, 2, 3, 301, 1, 3005, '2026-03-01 10:00:00', '2026-03-01 11:00:00', '2026-03-01 11:30:00', 15.36620000, 75.12560000, 'Chit fund fraud and cheating of 50 depositors to the tune of Rs. 80 lakhs in Suburban PS area, Hubballi. Accused Anand Joshi absconded before being apprehended by special task force under IPC Section 420.');

-- ==========================================================================
-- 5. INSERT 40 REALISTIC Accused RECORDS (Karnataka Names)
-- ==========================================================================
INSERT INTO Accused (AccusedMasterID, CaseMasterID, AccusedName, AgeYear, GenderID, PersonID) VALUES
  (1, 1, 'Manjunath Hiremath', 32, 1, 'A1'),
  (2, 1, 'Basavaraj Patil', 29, 1, 'A2'),
  (3, 2, 'Shivakumar Kulkarni', 35, 1, 'A1'),
  (4, 2, 'Pradeep Gowda', 27, 1, 'A2'),
  (5, 3, 'Karthik Shetty', 24, 1, 'A1'),
  (6, 3, 'Nagarajappa B', 41, 1, 'A2'),
  (7, 4, 'Girish Rao', 38, 1, 'A1'),
  (8, 4, 'Suresh Pujari', 31, 1, 'A2'),
  (9, 5, 'Ramesh K', 36, 1, 'A1'),
  (10, 5, 'Vijayakumar N', 33, 1, 'A2'),
  (11, 6, 'Raghavendra S', 30, 1, 'A1'),
  (12, 6, 'Anjaneya M', 28, 1, 'A2'),
  (13, 7, 'Harish Naik', 34, 1, 'A1'),
  (14, 7, 'Sowmya Hegde', 29, 2, 'A2'),
  (15, 8, 'Darshan S', 23, 1, 'A1'),
  (16, 8, 'Mahesh Kumar', 26, 1, 'A2'),
  (17, 9, 'Satish Kumar V', 39, 1, 'A1'),
  (18, 9, 'Yellappa M', 42, 1, 'A2'),
  (19, 10, 'Pramod Muthalik', 45, 1, 'A1'),
  (20, 10, 'Shankarappa C', 37, 1, 'A2'),
  (21, 11, 'Veeresh S', 25, 1, 'A1'),
  (22, 11, 'Kumaraswamy B', 31, 1, 'A2'),
  (23, 12, 'Nagesh Gowda', 34, 1, 'A1'),
  (24, 12, 'Renuka H', 30, 2, 'A2'),
  (25, 13, 'Prakash Acharya', 33, 1, 'A1'),
  (26, 13, 'Gururaj Poojari', 28, 1, 'A2'),
  (27, 14, 'Sunil Poojary', 36, 1, 'A1'),
  (28, 14, 'Divakar Shetty', 40, 1, 'A2'),
  (29, 15, 'Mohammed Shafi', 31, 1, 'A1'),
  (30, 15, 'Ibrahim Beary', 35, 1, 'A2'),
  (31, 16, 'Abdul Rehman', 29, 1, 'A1'),
  (32, 16, 'Mustafa K', 33, 1, 'A2'),
  (33, 17, 'Mallikarjun Kulkarni', 44, 1, 'A1'),
  (34, 17, 'Sanjeev Deshpande', 38, 1, 'A2'),
  (35, 18, 'Basavaraj Dharwad', 26, 1, 'A1'),
  (36, 18, 'Channabasappa H', 30, 1, 'A2'),
  (37, 19, 'Santosh Kumar', 34, 1, 'A1'),
  (38, 19, 'Deepak Joshi', 29, 1, 'A2'),
  (39, 20, 'Anand Joshi', 42, 1, 'A1'),
  (40, 20, 'Raghavendra Rao', 39, 1, 'A2');

-- ==========================================================================
-- 6. INSERT 30 REALISTIC Victim RECORDS
-- ==========================================================================
INSERT INTO Victim (VictimMasterID, CaseMasterID, VictimName, AgeYear, GenderID, VictimPolice) VALUES
  (1, 1, 'Anand Murthy', 45, 1, '0'),
  (2, 1, 'Padmavathi A', 40, 2, '0'),
  (3, 2, 'Chandrashekar S', 38, 1, '0'),
  (4, 3, 'Kiran Kumar', 32, 1, '0'),
  (5, 3, 'Sunitha M', 29, 2, '0'),
  (6, 4, 'Arun Kumar G', 35, 1, '0'),
  (7, 5, 'Raja Ram', 50, 1, '0'),
  (8, 5, 'Gowramma R', 46, 2, '0'),
  (9, 6, 'Lakshmi Bai', 25, 2, '0'),
  (10, 7, 'Radha S', 28, 2, '0'),
  (11, 8, 'Vijayendra B', 41, 1, '0'),
  (12, 8, 'Srinivas Murthy', 36, 1, '0'),
  (13, 9, 'Gopalakrishna H', 44, 1, '0'),
  (14, 10, 'Narayan Rao', 52, 1, '0'),
  (15, 10, 'Shakunthala N', 48, 2, '0'),
  (16, 11, 'Bhaskar Shetty', 39, 1, '0'),
  (17, 12, 'Preeti Gowda', 27, 2, '0'),
  (18, 13, 'Raghuram P', 47, 1, '0'),
  (19, 13, 'Nandini R', 42, 2, '0'),
  (20, 14, 'Vishwanath Acharya', 55, 1, '0'),
  (21, 15, 'Siddharth Kamath', 34, 1, '0'),
  (22, 15, 'Savitha Kamath', 31, 2, '0'),
  (23, 16, 'Punit Raj', 30, 1, '0'),
  (24, 17, 'Jagadish Kulkarni', 49, 1, '0'),
  (25, 17, 'Kasturi J', 45, 2, '0'),
  (26, 18, 'Shridhar Joshi', 38, 1, '0'),
  (27, 19, 'Ashwini D', 24, 2, '0'),
  (28, 20, 'Mahadevappa H', 58, 1, '0'),
  (29, 20, 'Parvathi M', 53, 2, '0'),
  (30, 20, 'Praveen M', 26, 1, '0');

-- ==========================================================================
-- 7. INSERT 20 REALISTIC ComplainantDetails RECORDS
-- ==========================================================================
INSERT INTO ComplainantDetails (ComplainantID, CaseMasterID, ComplainantName, AgeYear, OccupationID, ReligionID, CasteID, GenderID) VALUES
  (1, 1, 'Prashanth Murthy', 42, 1, 1, 1, 1),
  (2, 2, 'Chandrashekar S', 38, 2, 1, 2, 1),
  (3, 3, 'Kiran Kumar', 32, 2, 1, 1, 1),
  (4, 4, 'Arun Kumar G', 35, 1, 1, 3, 1),
  (5, 5, 'Ravi Ram', 48, 1, 1, 1, 1),
  (6, 6, 'Lakshmi Bai', 25, 5, 1, 2, 2),
  (7, 7, 'Radha S', 28, 4, 1, 2, 2),
  (8, 8, 'Vijayendra B', 41, 2, 1, 1, 1),
  (9, 9, 'Gopalakrishna H', 44, 3, 1, 4, 1),
  (10, 10, 'Narayan Rao', 52, 1, 1, 1, 1),
  (11, 11, 'Bhaskar Shetty', 39, 1, 1, 2, 1),
  (12, 12, 'Preeti Gowda', 27, 4, 1, 2, 2),
  (13, 13, 'Raghuram P', 47, 1, 1, 1, 1),
  (14, 14, 'Vishwanath Acharya', 55, 3, 1, 4, 1),
  (15, 15, 'Siddharth Kamath', 34, 2, 1, 1, 1),
  (16, 16, 'Punit Raj', 30, 2, 1, 2, 1),
  (17, 17, 'Jagadish Kulkarni', 49, 3, 1, 3, 1),
  (18, 18, 'Shridhar Joshi', 38, 1, 1, 1, 1),
  (19, 19, 'Ashwini D', 24, 5, 1, 2, 2),
  (20, 20, 'Mahadevappa H', 58, 4, 1, 3, 1);

-- ==========================================================================
-- 8. INSERT 20 ActSectionAssociation RECORDS (Fix #1: VARCHAR ActID/SectionID)
-- ==========================================================================
INSERT INTO ActSectionAssociation (CaseMasterID, ActID, SectionID, ActOrderID, SectionOrderID) VALUES
  (1, '1', '302', 1, 1),
  (2, '1', '307', 1, 1),
  (3, '1', '379', 1, 1),
  (4, '1', '420', 1, 1),
  (5, '1', '302', 1, 1),
  (6, '1', '376', 1, 1),
  (7, '1', '498A', 1, 1),
  (8, '1', '379', 1, 1),
  (9, '1', '307', 1, 1),
  (10, '1', '420', 1, 1),
  (11, '1', '379', 1, 1),
  (12, '1', '498A', 1, 1),
  (13, '1', '302', 1, 1),
  (14, '1', '379', 1, 1),
  (15, '1', '420', 1, 1),
  (16, '1', '307', 1, 1),
  (17, '1', '302', 1, 1),
  (18, '1', '379', 1, 1),
  (19, '1', '376', 1, 1),
  (20, '1', '420', 1, 1);

-- ==========================================================================
-- 9. INSERT 15 REALISTIC ArrestSurrender RECORDS
-- ==========================================================================
INSERT INTO ArrestSurrender (ArrestSurrenderID, CaseMasterID, ArrestSurrenderTypeID, ArrestSurrenderDate, ArrestSurrenderStateId, ArrestSurrenderDistrictId, PoliceStationID, IOID, CourtID, AccusedMasterID, IsAccused, IsComplainantAccused) VALUES
  (1, 1, 1, '2026-01-12', 29, 1001, 2001, 101, 3001, 1, '1', '0'),
  (2, 1, 1, '2026-01-13', 29, 1001, 2001, 101, 3001, 2, '1', '0'),
  (3, 2, 1, '2026-01-16', 29, 1001, 2001, 101, 3001, 3, '1', '0'),
  (4, 3, 2, '2026-01-25', 29, 1001, 2001, 101, 3001, 5, '1', '0'),
  (5, 5, 1, '2026-01-14', 29, 1001, 2002, 102, 3002, 9, '1', '0'),
  (6, 6, 1, '2026-01-20', 29, 1001, 2002, 102, 3002, 11, '1', '0'),
  (7, 7, 2, '2026-02-04', 29, 1001, 2002, 102, 3002, 13, '1', '0'),
  (8, 9, 1, '2026-01-15', 29, 1002, 2003, 103, 3003, 17, '1', '0'),
  (9, 10, 1, '2026-01-28', 29, 1002, 2003, 103, 3003, 19, '1', '0'),
  (10, 11, 1, '2026-02-10', 29, 1002, 2003, 103, 3003, 21, '1', '0'),
  (11, 13, 1, '2026-01-10', 29, 1003, 2004, 104, 3004, 25, '1', '0'),
  (12, 14, 2, '2026-02-01', 29, 1003, 2004, 104, 3004, 27, '1', '0'),
  (13, 16, 1, '2026-03-02', 29, 1003, 2004, 104, 3004, 31, '1', '0'),
  (14, 17, 1, '2026-01-18', 29, 1004, 2005, 105, 3005, 33, '1', '0'),
  (15, 19, 1, '2026-02-20', 29, 1004, 2005, 105, 3005, 37, '1', '0');

-- ==========================================================================
-- 10. INSERT ChargesheetDetails RECORDS (Fix #3: cases with CaseStatusID=2)
-- ==========================================================================
INSERT INTO ChargesheetDetails (CSID, CaseMasterID, csdate, cstype, PolicePersonID) VALUES
  (1, 3, '2026-02-15', 'A', 101),
  (2, 7, '2026-02-20', 'A', 102),
  (3, 10, '2026-02-28', 'A', 103),
  (4, 15, '2026-03-05', 'A', 104);

-- ==========================================================================
-- 11. VERIFICATION QUERIES (Optional Check)
-- ==========================================================================
-- SELECT c.CrimeNo, c.CaseNo, d.DistrictName, u.UnitName, c.CrimeRegisteredDate FROM CaseMaster c JOIN District d ON c.PoliceStationID = u.UnitID;
-- SELECT COUNT(*) AS total_cases FROM CaseMaster; -- Expected: 20
-- SELECT COUNT(*) AS total_accused FROM Accused;  -- Expected: 40
-- SELECT COUNT(*) AS total_victims FROM Victim;   -- Expected: 30
-- SELECT COUNT(*) AS total_complainants FROM ComplainantDetails; -- Expected: 20
-- SELECT COUNT(*) AS total_arrests FROM ArrestSurrender; -- Expected: 15
-- SELECT COUNT(*) AS total_chargesheets FROM ChargesheetDetails; -- Expected: 4
-- SELECT COUNT(*) AS total_crime_head_mappings FROM CrimeHeadActSection; -- Expected: 10
-- SELECT SectionCode, SectionDescription FROM Section WHERE SectionCode = '498A'; -- Expected: '498A' without truncation or type error
