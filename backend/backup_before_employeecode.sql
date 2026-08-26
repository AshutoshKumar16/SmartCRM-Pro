--
-- PostgreSQL database dump
--

\restrict KwaCzIBpXRilm5sqIXaeEFws50viE0vtZsc8kVggFQDYldCXbIQtNJHkW5z0B9v

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: LeadStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."LeadStatus" AS ENUM (
    'NEW',
    'CONTACTED',
    'MEETING',
    'PROPOSAL',
    'WON',
    'LOST'
);


ALTER TYPE public."LeadStatus" OWNER TO postgres;

--
-- Name: MeetingStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MeetingStatus" AS ENUM (
    'SCHEDULED',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."MeetingStatus" OWNER TO postgres;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PAID',
    'PENDING',
    'OVERDUE'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- Name: Priority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Priority" AS ENUM (
    'HIGH',
    'MEDIUM',
    'LOW'
);


ALTER TYPE public."Priority" OWNER TO postgres;

--
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'MANAGER',
    'SALES_EXEC'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: TaskStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."TaskStatus" AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'DONE'
);


ALTER TYPE public."TaskStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ActivityLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ActivityLog" (
    id text NOT NULL,
    "userId" text NOT NULL,
    action text NOT NULL,
    "entityType" text,
    "entityId" text,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ActivityLog" OWNER TO postgres;

--
-- Name: Customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Customer" (
    id text NOT NULL,
    "leadId" text NOT NULL,
    "companyName" text NOT NULL,
    "projectName" text,
    "totalValue" double precision DEFAULT 0 NOT NULL,
    "healthScore" integer DEFAULT 100 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Customer" OWNER TO postgres;

--
-- Name: File; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."File" (
    id text NOT NULL,
    "customerId" text NOT NULL,
    filename text NOT NULL,
    "fileUrl" text NOT NULL,
    "fileType" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."File" OWNER TO postgres;

--
-- Name: Invoice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Invoice" (
    id text NOT NULL,
    "customerId" text NOT NULL,
    amount double precision NOT NULL,
    gst double precision DEFAULT 0 NOT NULL,
    total double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Invoice" OWNER TO postgres;

--
-- Name: Lead; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Lead" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    budget text,
    source text DEFAULT 'WEBSITE'::text NOT NULL,
    status public."LeadStatus" DEFAULT 'NEW'::public."LeadStatus" NOT NULL,
    score integer DEFAULT 0 NOT NULL,
    "assignedToId" text,
    "createdById" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Lead" OWNER TO postgres;

--
-- Name: Meeting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Meeting" (
    id text NOT NULL,
    title text NOT NULL,
    "leadId" text,
    "customerId" text,
    "scheduledAt" timestamp(3) without time zone NOT NULL,
    notes text,
    status public."MeetingStatus" DEFAULT 'SCHEDULED'::public."MeetingStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Meeting" OWNER TO postgres;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    "userId" text NOT NULL,
    message text NOT NULL,
    type text NOT NULL,
    "isRead" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: Payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    "customerId" text NOT NULL,
    amount double precision NOT NULL,
    status public."PaymentStatus" DEFAULT 'PENDING'::public."PaymentStatus" NOT NULL,
    "dueDate" timestamp(3) without time zone,
    "paidAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Payment" OWNER TO postgres;

--
-- Name: Task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Task" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "assignedToId" text NOT NULL,
    "leadId" text,
    priority public."Priority" DEFAULT 'MEDIUM'::public."Priority" NOT NULL,
    status public."TaskStatus" DEFAULT 'PENDING'::public."TaskStatus" NOT NULL,
    "dueDate" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Task" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role public."Role" DEFAULT 'SALES_EXEC'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Data for Name: ActivityLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ActivityLog" (id, "userId", action, "entityType", "entityId", metadata, "createdAt") FROM stdin;
7b1f5f20-9e06-40f4-a2ae-d62814320682	15c463d7-a886-4bf7-8c6c-ab113beb4607	Changed lead status to NEW	Lead	cb40fce9-1b88-4c32-93f9-c8b68cd0ad1a	{"name": "Ashutosh sinha", "status": "NEW"}	2026-08-20 15:01:08.852
cb51c54b-46ad-442c-b62f-d9a94b97a1ce	15c463d7-a886-4bf7-8c6c-ab113beb4607	Changed lead status to NEW	Lead	4f9ebbd5-4dc5-48da-a977-35c4320e442d	{"name": "Ashutosh Kumar", "status": "NEW"}	2026-08-20 15:01:17.744
71ce7f45-7dbf-46cd-9801-d8e2ec35f04f	15c463d7-a886-4bf7-8c6c-ab113beb4607	Changed lead status to MEETING	Lead	2c6d92fc-a548-459d-a4ca-4103d2eadefa	{"name": "Test Lead One", "status": "MEETING"}	2026-08-20 15:01:35.552
07212750-5866-4b8a-9a45-a402f8ac1b91	15c463d7-a886-4bf7-8c6c-ab113beb4607	Changed lead status to PROPOSAL	Lead	5f93c6ca-c19c-4bfc-b6a5-5108607fa3e8	{"name": "John Doe", "status": "PROPOSAL"}	2026-08-20 15:01:37.646
7f803b5a-5bcb-45cc-975d-9774795a9b60	15c463d7-a886-4bf7-8c6c-ab113beb4607	Changed lead status to NEW	Lead	3096826f-8a86-473d-a2ae-c0ec904e52c5	{"name": "Lead Test 1", "status": "NEW"}	2026-08-20 15:02:39.871
7db08d30-7d08-4689-b699-f5040d8eed1f	15c463d7-a886-4bf7-8c6c-ab113beb4607	Changed lead status to MEETING	Lead	c22e93eb-abd5-485a-a873-51fd57cb578c	{"name": "Live Test Lead", "status": "MEETING"}	2026-08-23 17:30:09.038
57a875ea-32b9-413f-af0e-057289d15c68	15c463d7-a886-4bf7-8c6c-ab113beb4607	Changed lead status to CONTACTED	Lead	4f9ebbd5-4dc5-48da-a977-35c4320e442d	{"name": "Ashutosh Kumar", "status": "CONTACTED"}	2026-08-26 10:00:26.109
e1a7b3d9-e356-47f1-86c9-eac9a9482418	15c463d7-a886-4bf7-8c6c-ab113beb4607	Changed lead status to PROPOSAL	Lead	3096826f-8a86-473d-a2ae-c0ec904e52c5	{"name": "Lead Test 1", "status": "PROPOSAL"}	2026-08-26 10:00:28.69
91890119-6a4d-418e-9bf4-209871e8d8c2	15c463d7-a886-4bf7-8c6c-ab113beb4607	Changed lead status to WON	Lead	cacd35ce-ee16-4ef7-b2e4-0bc62afed663	{"name": "Test user", "status": "WON"}	2026-08-26 10:00:31.399
01606364-5bb2-4756-8955-9b73cc4d2071	15c463d7-a886-4bf7-8c6c-ab113beb4607	Changed lead status to LOST	Lead	cb40fce9-1b88-4c32-93f9-c8b68cd0ad1a	{"name": "Ashutosh sinha", "status": "LOST"}	2026-08-26 10:00:33.648
a5336ccc-65f0-41b1-9f51-524c67c7a1e8	15c463d7-a886-4bf7-8c6c-ab113beb4607	Changed lead status to WON	Lead	c22e93eb-abd5-485a-a873-51fd57cb578c	{"name": "Live Test Lead", "status": "WON"}	2026-08-26 18:48:07.468
\.


--
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Customer" (id, "leadId", "companyName", "projectName", "totalValue", "healthScore", "createdAt", "updatedAt") FROM stdin;
a9f275cb-40a8-44b5-9468-05b4a6a5f883	4f9ebbd5-4dc5-48da-a977-35c4320e442d	easy.com	crm implementation	50	100	2026-06-27 13:00:51.579	2026-06-27 13:00:51.579
\.


--
-- Data for Name: File; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."File" (id, "customerId", filename, "fileUrl", "fileType", "createdAt") FROM stdin;
\.


--
-- Data for Name: Invoice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Invoice" (id, "customerId", amount, gst, total, "createdAt") FROM stdin;
\.


--
-- Data for Name: Lead; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Lead" (id, name, email, phone, company, budget, source, status, score, "assignedToId", "createdById", "createdAt", "updatedAt") FROM stdin;
60984e94-1c88-49ae-ad97-5e76230651db	Lead Test 2	leadtest2@example.com	\N	\N	\N	WEBSITE	NEW	0	3473cc60-6c0a-4aa0-92dd-0fd050cad85a	15c463d7-a886-4bf7-8c6c-ab113beb4607	2026-08-02 17:54:27.202	2026-08-02 17:54:27.202
1b56c7d7-412b-4fe6-be7e-985b28cc6f6d	Lead Test 3	leadtest3@example.com	\N	\N	\N	WEBSITE	NEW	0	ecee346a-8e93-4ff3-89b0-c57b4fec95c6	15c463d7-a886-4bf7-8c6c-ab113beb4607	2026-08-02 17:54:30.171	2026-08-02 17:54:30.171
ce573673-6e00-4eb5-982b-22947653d620	Lead Test 4	leadtest4@example.com	\N	\N	\N	WEBSITE	NEW	0	362aa618-e588-4030-9df9-e22e18d03b0e	15c463d7-a886-4bf7-8c6c-ab113beb4607	2026-08-02 17:54:32.964	2026-08-02 17:54:32.964
9f4aa87d-34a0-4916-b1ef-c409072a27b7	Lead Test 5	leadtest5@example.com	\N	\N	\N	WEBSITE	MEETING	0	be070591-87d9-473d-baaa-c569fae21bf4	15c463d7-a886-4bf7-8c6c-ab113beb4607	2026-08-02 17:54:35.922	2026-08-15 19:02:30.554
2c6d92fc-a548-459d-a4ca-4103d2eadefa	Test Lead One	testlead1@example.com	\N	\N	\N	WEBSITE	MEETING	0	be070591-87d9-473d-baaa-c569fae21bf4	15c463d7-a886-4bf7-8c6c-ab113beb4607	2026-08-02 17:44:28.408	2026-08-20 15:01:35.55
5f93c6ca-c19c-4bfc-b6a5-5108607fa3e8	John Doe	john@example.com	\N	\N	\N	MANUAL	PROPOSAL	0	\N	15c463d7-a886-4bf7-8c6c-ab113beb4607	2026-07-27 13:40:18.136	2026-08-20 15:01:37.644
4f9ebbd5-4dc5-48da-a977-35c4320e442d	Ashutosh Kumar	ashutoshsinha@gmail.com	123456890	easy.com	5-10lakhs	MANUAL	CONTACTED	0	15c463d7-a886-4bf7-8c6c-ab113beb4607	15c463d7-a886-4bf7-8c6c-ab113beb4607	2026-06-26 18:35:22.591	2026-08-26 10:00:26.069
3096826f-8a86-473d-a2ae-c0ec904e52c5	Lead Test 1	leadtest1@example.com	\N	\N	\N	WEBSITE	PROPOSAL	0	6d8c11b6-d424-4970-97d1-1b8914071265	15c463d7-a886-4bf7-8c6c-ab113beb4607	2026-08-02 17:54:23.792	2026-08-26 10:00:28.648
cacd35ce-ee16-4ef7-b2e4-0bc62afed663	Test user	test@test.com	9876543210	Test Company	₹5L - ₹10L	WEBSITE	WON	0	\N	15c463d7-a886-4bf7-8c6c-ab113beb4607	2026-06-22 08:46:19.569	2026-08-26 10:00:31.333
cb40fce9-1b88-4c32-93f9-c8b68cd0ad1a	Ashutosh sinha	venomfrost75@gmail.com	+910000000000	hybrid.com	10L-20L	MANUAL	LOST	0	\N	15c463d7-a886-4bf7-8c6c-ab113beb4607	2026-07-02 15:15:56.239	2026-08-26 10:00:33.581
c22e93eb-abd5-485a-a873-51fd57cb578c	Live Test Lead	livetest@example.com	\N	\N	\N	WEBSITE	WON	0	6d8c11b6-d424-4970-97d1-1b8914071265	15c463d7-a886-4bf7-8c6c-ab113beb4607	2026-08-15 19:21:34.566	2026-08-26 18:48:07.443
\.


--
-- Data for Name: Meeting; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Meeting" (id, title, "leadId", "customerId", "scheduledAt", notes, status, "createdAt") FROM stdin;
a207c241-cd4d-4b57-91bd-6fef91ac50ca	website 	\N	\N	2026-06-30 11:20:00	to won the lead yeeeaaaaaaah	CANCELLED	2026-06-28 09:18:49.849
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, "userId", message, type, "isRead", "createdAt") FROM stdin;
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Payment" (id, "customerId", amount, status, "dueDate", "paidAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: Task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Task" (id, title, description, "assignedToId", "leadId", priority, status, "dueDate", "createdAt", "updatedAt") FROM stdin;
011b5770-ad6c-4189-924e-7ad9d4df9de5	web	nothing	15c463d7-a886-4bf7-8c6c-ab113beb4607	\N	HIGH	PENDING	2026-06-29 00:00:00	2026-06-28 09:19:11.995	2026-06-28 09:19:11.995
269cdd96-f382-4aaa-92fa-c8fedbff1000	Follow up call with Ashutosh"		15c463d7-a886-4bf7-8c6c-ab113beb4607	\N	HIGH	PENDING	2026-06-29 00:00:00	2026-06-28 09:19:33.672	2026-06-28 09:19:33.672
8c029d04-67f8-41de-a937-efe02941b794	Follow up with client	\N	15c463d7-a886-4bf7-8c6c-ab113beb4607	\N	MEDIUM	PENDING	\N	2026-08-15 18:52:53.309	2026-08-15 18:52:53.309
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, name, email, password, role, "createdAt", "updatedAt") FROM stdin;
15c463d7-a886-4bf7-8c6c-ab113beb4607	Admin User	ashutoshsinha707@gmail.com	$2b$12$ya8UEMXL6mwKJskxMckEqeb6PK18nHCtUigSn/gvzmmm.87JLDD1a	ADMIN	2026-06-20 18:04:10.89	2026-06-20 18:04:10.89
be070591-87d9-473d-baaa-c569fae21bf4	Rahul Sharma	never75mind@gmail.com	$2b$12$HBge.slMJzFhQw8prKyGxeeBoR5TJOEJsReiVuFUStDPFLX8vwuay	SALES_EXEC	2026-07-03 10:35:45.382	2026-07-03 10:35:45.382
6d8c11b6-d424-4970-97d1-1b8914071265	Priya Verma	priya@test.com	$2b$12$zSkyQrYuhya.TZtum/0K/.5J4Rkn3snXb2OIQMn.4ubeqf04AkEr6	SALES_EXEC	2026-08-02 17:50:59.345	2026-08-02 17:50:59.345
3473cc60-6c0a-4aa0-92dd-0fd050cad85a	Rohan Gupta	rohan@test.com	$2b$12$xdYqChSGTukM6fEb.W9vKe7skLvIh8tMJ3xuYAyhEkoOht0ZQKiry	SALES_EXEC	2026-08-02 17:53:11.571	2026-08-02 17:53:11.571
ecee346a-8e93-4ff3-89b0-c57b4fec95c6	Sneha Singh	sneha@test.com	$2b$12$ISvSY0QuUltBl1NG9WHKzeM38Yq4FjLDoHAs4xED8J4WjFB2buEs2	SALES_EXEC	2026-08-02 17:53:11.869	2026-08-02 17:53:11.869
362aa618-e588-4030-9df9-e22e18d03b0e	Vikram Rao	vikram@test.com	$2b$12$YJczuEDH3bWn3lzU3pW/YuyGEtBSAkkrRgD6ZfETP.17E8axNu7eG	SALES_EXEC	2026-08-02 17:53:12.126	2026-08-02 17:53:12.126
6699ad75-d195-4d64-8bc0-461b5e86fc5c	VIshal Kr yadav	vishal@test.com	$2b$12$sPDWBZvJgw17J3HX1yDLuexv0LFMdNfH7CWaV3OhxHH/VTn/JO.7.	SALES_EXEC	2026-08-15 18:37:07.594	2026-08-15 18:37:07.594
99bcfd4c-fc4d-47ae-b396-455c7cc7ba47	my name is chad	ashuastor01@gmail.com	$2b$12$zyIHVExH9i06i/km2Ce8re1hL/khngEJsQsfYIGX.ctI0vwYzWRoa	SALES_EXEC	2026-08-20 14:59:28.312	2026-08-20 14:59:28.312
\.


--
-- Name: ActivityLog ActivityLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityLog"
    ADD CONSTRAINT "ActivityLog_pkey" PRIMARY KEY (id);


--
-- Name: Customer Customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_pkey" PRIMARY KEY (id);


--
-- Name: File File_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_pkey" PRIMARY KEY (id);


--
-- Name: Invoice Invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY (id);


--
-- Name: Lead Lead_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lead"
    ADD CONSTRAINT "Lead_pkey" PRIMARY KEY (id);


--
-- Name: Meeting Meeting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Meeting"
    ADD CONSTRAINT "Meeting_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: Task Task_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Customer_leadId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Customer_leadId_key" ON public."Customer" USING btree ("leadId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: ActivityLog ActivityLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityLog"
    ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Customer Customer_leadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES public."Lead"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: File File_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."File"
    ADD CONSTRAINT "File_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Invoice Invoice_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Lead Lead_assignedToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lead"
    ADD CONSTRAINT "Lead_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Lead Lead_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Lead"
    ADD CONSTRAINT "Lead_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Meeting Meeting_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Meeting"
    ADD CONSTRAINT "Meeting_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Meeting Meeting_leadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Meeting"
    ADD CONSTRAINT "Meeting_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES public."Lead"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Task Task_assignedToId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Task Task_leadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES public."Lead"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict KwaCzIBpXRilm5sqIXaeEFws50viE0vtZsc8kVggFQDYldCXbIQtNJHkW5z0B9v

