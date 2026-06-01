SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict BD5ejA6e14yhnctwACh9es3kqyyfigoQcg4atEcLW7Adq3jQcfd9bMIhiq1ieF0

-- Dumped from database version 15.14
-- Dumped by pg_dump version 17.6

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
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
00000000-0000-0000-0000-000000000000	5364c0c3-3027-4758-8d31-7a4ffac825ed	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"escritorio@carmella.com.br","user_id":"1c544b97-3e8a-4231-bb96-7faa12ff49a3","user_phone":""}}	2026-02-16 12:44:40.394956+00	
00000000-0000-0000-0000-000000000000	cfe023d9-db57-4720-8303-90a4ace1674f	{"action":"login","actor_id":"1c544b97-3e8a-4231-bb96-7faa12ff49a3","actor_username":"escritorio@carmella.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-02-16 12:44:48.43967+00	
00000000-0000-0000-0000-000000000000	9f425c76-0d2a-4f66-acc6-af9bfe5bb513	{"action":"logout","actor_id":"1c544b97-3e8a-4231-bb96-7faa12ff49a3","actor_username":"escritorio@carmella.com.br","actor_via_sso":false,"log_type":"account"}	2026-02-16 13:03:05.293575+00	
00000000-0000-0000-0000-000000000000	b585a2a1-15a2-414d-8ee2-e2b3e529477d	{"action":"login","actor_id":"1c544b97-3e8a-4231-bb96-7faa12ff49a3","actor_username":"escritorio@carmella.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-02-16 13:03:11.889237+00	
00000000-0000-0000-0000-000000000000	f82e457e-0512-445b-9c9b-b9fe1ad4cf94	{"action":"logout","actor_id":"1c544b97-3e8a-4231-bb96-7faa12ff49a3","actor_username":"escritorio@carmella.com.br","actor_via_sso":false,"log_type":"account"}	2026-02-16 13:06:50.448429+00	
00000000-0000-0000-0000-000000000000	9a0e17ed-6ba4-431e-8076-78c26f2ac337	{"action":"login","actor_id":"1c544b97-3e8a-4231-bb96-7faa12ff49a3","actor_username":"escritorio@carmella.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-02-16 13:06:54.95204+00	
00000000-0000-0000-0000-000000000000	0a6f921d-1a68-4d59-9cc8-178eed844b74	{"action":"logout","actor_id":"1c544b97-3e8a-4231-bb96-7faa12ff49a3","actor_username":"escritorio@carmella.com.br","actor_via_sso":false,"log_type":"account"}	2026-02-16 14:04:42.693867+00	
00000000-0000-0000-0000-000000000000	1b91e92c-45fe-4f30-90db-2ef301cf474e	{"action":"login","actor_id":"1c544b97-3e8a-4231-bb96-7faa12ff49a3","actor_username":"escritorio@carmella.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-02-16 14:07:06.033737+00	
00000000-0000-0000-0000-000000000000	c675a48b-8575-4e90-89c8-5dd832c8f660	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"mh.escritorio.hub@gmail.com","user_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","user_phone":""}}	2026-02-16 14:09:29.239027+00	
00000000-0000-0000-0000-000000000000	a09a5e6a-0653-4e1a-b991-163ac107abab	{"action":"logout","actor_id":"1c544b97-3e8a-4231-bb96-7faa12ff49a3","actor_username":"escritorio@carmella.com.br","actor_via_sso":false,"log_type":"account"}	2026-02-16 14:09:43.24234+00	
00000000-0000-0000-0000-000000000000	21bc4484-6fab-40da-a33d-2dabe0174751	{"action":"login","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-02-16 14:09:51.217909+00	
00000000-0000-0000-0000-000000000000	4bb04a64-61a6-4689-a5f6-04cc8addeae1	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"escritorio@carmella.com.br","user_id":"1c544b97-3e8a-4231-bb96-7faa12ff49a3","user_phone":""}}	2026-02-16 17:12:01.078995+00	
00000000-0000-0000-0000-000000000000	4cda9edc-6576-4c88-a5e5-89475def7853	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"henocera@gmail.com","user_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","user_phone":""}}	2026-02-16 17:12:12.864975+00	
00000000-0000-0000-0000-000000000000	2f0e6d78-9592-4961-a135-04e9b85ccf29	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-02-16 17:12:19.115652+00	
00000000-0000-0000-0000-000000000000	0f8adbba-a4d2-4282-941f-a428421b9921	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-17 13:20:10.938125+00	
00000000-0000-0000-0000-000000000000	35e1aa86-6291-4965-97e5-89d6598528c2	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-17 13:20:10.955963+00	
00000000-0000-0000-0000-000000000000	913f0c15-c7e3-40dc-b3f3-899682a5ab3e	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-17 19:21:58.406906+00	
00000000-0000-0000-0000-000000000000	2f569bf3-a777-451b-8af2-82bc737633d1	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-17 19:21:58.423915+00	
00000000-0000-0000-0000-000000000000	aeaa9364-6731-4e1c-9a6d-b9540aa6f2c6	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-17 20:59:58.618777+00	
00000000-0000-0000-0000-000000000000	e76bef0c-5f44-42e0-9f3c-b46d55b69cef	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-17 20:59:58.625027+00	
00000000-0000-0000-0000-000000000000	e3bb2b4b-27fb-4871-979f-ce9058cc8ba4	{"action":"login","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-02-18 12:48:15.886254+00	
00000000-0000-0000-0000-000000000000	6f45cb89-e298-4286-a57e-80f227670db6	{"action":"logout","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-02-18 12:59:52.287586+00	
00000000-0000-0000-0000-000000000000	f709b250-38f0-4872-985b-d14299143453	{"action":"login","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-02-18 12:59:58.072693+00	
00000000-0000-0000-0000-000000000000	0914eb3c-e9ff-4374-8a74-950d08801948	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-18 14:00:31.3369+00	
00000000-0000-0000-0000-000000000000	cb6e709b-4a30-4235-9051-afa8027a94d2	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-18 14:00:31.350324+00	
00000000-0000-0000-0000-000000000000	b909791e-92c5-4a78-b006-2b26b0b40f51	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-18 16:10:45.60301+00	
00000000-0000-0000-0000-000000000000	0c5c37ac-8d07-4e43-b0b4-da05951b8521	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-18 16:10:45.609894+00	
00000000-0000-0000-0000-000000000000	b633892f-b32c-4e92-b0c4-3931968bd5d9	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-18 17:42:57.462842+00	
00000000-0000-0000-0000-000000000000	130c9e20-2456-461c-872e-2b2f77ef9af0	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-18 17:42:57.474654+00	
00000000-0000-0000-0000-000000000000	11d07b33-3a19-471e-b337-9d2ad9078ee9	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-19 12:09:14.752486+00	
00000000-0000-0000-0000-000000000000	e3dfdc04-c3fc-4e7a-803b-34f298e64f76	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-19 12:09:14.772372+00	
00000000-0000-0000-0000-000000000000	19a57e9c-6cfd-4607-b390-07140d72e6af	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-19 13:23:34.96638+00	
00000000-0000-0000-0000-000000000000	680972b3-e99b-46a8-b936-0124fdc595a8	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-19 13:23:34.976031+00	
00000000-0000-0000-0000-000000000000	2bb7d8af-e58b-400b-a3d9-6f29b12ff3d9	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-19 15:04:52.777688+00	
00000000-0000-0000-0000-000000000000	8b1dd00d-192d-455a-83e9-040a8ccff4da	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-19 15:04:52.795779+00	
00000000-0000-0000-0000-000000000000	64155d2f-3670-48f5-a61c-0340ceb8d2de	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-19 16:13:30.682311+00	
00000000-0000-0000-0000-000000000000	cc36f8db-589b-4256-9581-f38a433d32f7	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-19 16:13:30.692145+00	
00000000-0000-0000-0000-000000000000	bd5150a5-1999-4246-bbad-23793cdc8330	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-19 17:29:16.059165+00	
00000000-0000-0000-0000-000000000000	e35c6517-7d26-438d-883f-24a4c6205317	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-19 17:29:16.072749+00	
00000000-0000-0000-0000-000000000000	a477455b-80fc-4e67-ba48-3391bba509ea	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-20 12:25:25.542318+00	
00000000-0000-0000-0000-000000000000	7039ca12-ba23-48c6-a7a8-449b6c85d9b1	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-20 12:25:25.56352+00	
00000000-0000-0000-0000-000000000000	46fb400d-7fdc-4481-b590-cfc17d8c0167	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-02-20 12:42:38.553623+00	
00000000-0000-0000-0000-000000000000	cf69773a-94a5-4435-8863-45ab9c28ae2e	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-20 13:33:28.511896+00	
00000000-0000-0000-0000-000000000000	915ac073-a84c-4faa-b256-cd698a9dd304	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-20 13:33:28.522877+00	
00000000-0000-0000-0000-000000000000	29d72115-f11f-4020-af4a-5d8710dbbef8	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-02-20 18:15:23.060065+00	
00000000-0000-0000-0000-000000000000	8b47793c-40df-449f-807b-e72c4eb76702	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-20 19:35:57.839227+00	
00000000-0000-0000-0000-000000000000	edb48597-a644-4aed-bd16-0f4e05c85824	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-20 19:35:57.845669+00	
00000000-0000-0000-0000-000000000000	8eff7ea0-3ac8-4dc6-9586-384a3220b5ef	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-22 14:48:21.979268+00	
00000000-0000-0000-0000-000000000000	20a19930-ef0a-41de-a99b-bb3d81a458c2	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-22 14:48:21.993627+00	
00000000-0000-0000-0000-000000000000	cda8b9e7-e2cd-45d9-b84b-6165280a9d06	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-22 15:57:26.953308+00	
00000000-0000-0000-0000-000000000000	2452392a-e708-4673-b814-44a8fe1617c9	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-22 15:57:26.96076+00	
00000000-0000-0000-0000-000000000000	21139d09-34df-4a6f-a9b3-b1bedf106e83	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-22 21:44:39.308638+00	
00000000-0000-0000-0000-000000000000	62421fdf-5118-4f44-b61c-484dbc3bdfc1	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-22 21:44:39.328253+00	
00000000-0000-0000-0000-000000000000	5e6e7b0c-29c0-491f-916b-e9942ded867e	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-02-23 11:09:08.237639+00	
00000000-0000-0000-0000-000000000000	5cb9d324-3140-4d40-83cc-a63ad29c0eea	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-23 12:08:24.436595+00	
00000000-0000-0000-0000-000000000000	bbb66db4-a00e-47d3-8dc0-a48ac4b89c1e	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-23 12:08:24.450288+00	
00000000-0000-0000-0000-000000000000	0c0f9a1d-5d0b-490f-9b6e-0bd1f8be2669	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-23 13:09:10.93391+00	
00000000-0000-0000-0000-000000000000	58c43cfc-d1be-473a-a779-6e75b0b562c6	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-23 13:09:10.943857+00	
00000000-0000-0000-0000-000000000000	d35a783e-28ad-41ff-b8d6-a9b819ab11a8	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-23 14:13:05.73778+00	
00000000-0000-0000-0000-000000000000	4053357e-1767-49dd-aa29-bb5ca90b86b0	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-23 14:13:05.751962+00	
00000000-0000-0000-0000-000000000000	22cdf902-7007-413c-bc35-63438169aba2	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-23 16:15:29.783322+00	
00000000-0000-0000-0000-000000000000	213146ff-02fd-4428-ba7f-138f8be1644a	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-23 16:15:29.79641+00	
00000000-0000-0000-0000-000000000000	4d1a9f08-547a-4cf6-aff3-0ef0a7462cbb	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-24 11:59:30.300193+00	
00000000-0000-0000-0000-000000000000	bfbf025a-a3f4-438c-b318-634a5e6f9efa	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-24 11:59:30.320407+00	
00000000-0000-0000-0000-000000000000	70f14156-d80f-461d-82bc-f3dba7cbaa31	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-24 12:14:48.904292+00	
00000000-0000-0000-0000-000000000000	c5b5c578-5435-470d-99bd-6c028b228446	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-24 12:14:48.917043+00	
00000000-0000-0000-0000-000000000000	847feec9-94da-49a0-99f8-c524994a8b50	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-24 13:20:49.936575+00	
00000000-0000-0000-0000-000000000000	5adb57fb-0e36-481f-89fa-f59afdc496f6	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-24 13:20:49.949252+00	
00000000-0000-0000-0000-000000000000	6fc24dd4-dfaa-4e10-b633-0923c2af2ed2	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-24 15:47:52.456086+00	
00000000-0000-0000-0000-000000000000	7869f480-ec71-4eb7-b28d-a7f1ea9777a1	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-24 15:47:52.470657+00	
00000000-0000-0000-0000-000000000000	c1bfeab7-9709-438a-880f-58eae4e20974	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-25 12:12:32.408079+00	
00000000-0000-0000-0000-000000000000	c249294d-dfa8-4317-870a-506fbbdb6b1d	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-25 12:12:32.431375+00	
00000000-0000-0000-0000-000000000000	7f400787-a11f-4b91-98ff-2b59854dc877	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-25 13:16:48.194203+00	
00000000-0000-0000-0000-000000000000	332e148a-3e6e-4a70-84d0-25f552a13dec	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-25 13:16:48.210091+00	
00000000-0000-0000-0000-000000000000	0f357f2a-b213-46b6-a5f2-60fd4d2d3f1d	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-25 14:41:42.673166+00	
00000000-0000-0000-0000-000000000000	c53a438c-43f6-4ece-a3d6-9ffb816e354f	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-25 14:41:42.68494+00	
00000000-0000-0000-0000-000000000000	8fc1b6f8-f7aa-48d8-aa0d-4929b5e58a6d	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-25 16:03:58.47199+00	
00000000-0000-0000-0000-000000000000	9dd444da-015b-4d2d-a772-6e3a6f1702a3	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-25 16:03:58.484775+00	
00000000-0000-0000-0000-000000000000	770c2397-96e1-4d05-9838-07a15b603032	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-25 20:26:56.983489+00	
00000000-0000-0000-0000-000000000000	5caa23db-fc4f-4346-b5b6-3a0563110f45	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-25 20:26:57.00085+00	
00000000-0000-0000-0000-000000000000	f04afab0-5efe-4a6f-bff8-7f95eaa9431e	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-02-25 20:27:05.256199+00	
00000000-0000-0000-0000-000000000000	70946280-e73c-4391-9289-da577b35c16b	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-02-25 20:27:12.051056+00	
00000000-0000-0000-0000-000000000000	ead919c0-ecb9-4356-8478-77d9dc9ead37	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-26 12:04:31.823613+00	
00000000-0000-0000-0000-000000000000	089cac04-3720-4674-a630-06b70a354534	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-26 12:04:31.842197+00	
00000000-0000-0000-0000-000000000000	ace32f71-4d28-4b64-b239-ed1dc2596f4c	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-26 13:28:42.383191+00	
00000000-0000-0000-0000-000000000000	0060f0e9-1c89-4a62-a14f-1656b1efae60	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-26 13:28:42.398432+00	
00000000-0000-0000-0000-000000000000	f4ac6a5d-57bb-4dd4-9e10-cb906767e70a	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-26 14:49:01.729431+00	
00000000-0000-0000-0000-000000000000	e131d806-d82c-4ddc-b74a-fefe2db0e55b	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-26 14:49:01.742589+00	
00000000-0000-0000-0000-000000000000	ab0cb18b-32d8-4d49-a485-5c460721aa44	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-26 17:26:10.80869+00	
00000000-0000-0000-0000-000000000000	8a2bf69c-895a-4457-8090-9a88cc329add	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-26 17:26:10.817729+00	
00000000-0000-0000-0000-000000000000	025093ad-53ed-464c-b1ce-7660103658f0	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-26 18:13:24.668173+00	
00000000-0000-0000-0000-000000000000	b26aca59-6303-441e-8c20-894faf526930	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-26 18:13:24.67819+00	
00000000-0000-0000-0000-000000000000	40a72580-cd5d-47db-8b14-23307d9f232d	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"sthefani.alves.def@gmail.com","user_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","user_phone":""}}	2026-02-26 18:22:13.358637+00	
00000000-0000-0000-0000-000000000000	2158bca4-05be-482e-b38e-5e72ae49d88a	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"marina_nocera@yahoo.com.br","user_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","user_phone":""}}	2026-02-26 18:29:52.882292+00	
00000000-0000-0000-0000-000000000000	ce32b9e1-6fba-4fec-b6df-a09ba511447b	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-02-26 18:33:58.301104+00	
00000000-0000-0000-0000-000000000000	05ed635b-6363-41e4-9459-1d72e7daedbe	{"action":"token_refreshed","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-26 19:39:17.160053+00	
00000000-0000-0000-0000-000000000000	3d3fd3a8-6e00-4534-9295-bbedc2d48319	{"action":"token_revoked","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-26 19:39:17.182719+00	
00000000-0000-0000-0000-000000000000	be4c1f18-ab87-4abb-bf10-0bebb3a4373d	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-27 12:03:16.143065+00	
00000000-0000-0000-0000-000000000000	de763db2-66b6-4748-921b-b0fa8c522405	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-27 12:03:16.162123+00	
00000000-0000-0000-0000-000000000000	ddecc022-9ae7-4357-9816-ad3ee1f46678	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-27 13:05:10.282025+00	
00000000-0000-0000-0000-000000000000	7315bdc1-e22c-4f2f-a337-be570ed447e9	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-27 13:05:10.292161+00	
00000000-0000-0000-0000-000000000000	1fef1dc3-b205-4e60-aab9-c1a3a9cb0ef2	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-27 15:07:18.177166+00	
00000000-0000-0000-0000-000000000000	fe51d457-dc63-45c9-87de-6e3b438827ca	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-27 15:07:18.183312+00	
00000000-0000-0000-0000-000000000000	f8dc67bb-5fa9-4ce0-8f1c-d06cb70f215c	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-27 16:22:08.187504+00	
00000000-0000-0000-0000-000000000000	1198a58f-f7b8-4e19-b395-578d2faf9f5b	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-27 16:22:08.205774+00	
00000000-0000-0000-0000-000000000000	634243ff-097c-4175-b9ba-3d8f0ec557f4	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-27 16:28:47.643305+00	
00000000-0000-0000-0000-000000000000	913204df-6801-46ff-9ca5-45d6702a6a4e	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-27 16:28:47.653237+00	
00000000-0000-0000-0000-000000000000	f5a95a5d-1ceb-4422-b34a-2cf6b447a5db	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-02-27 16:29:00.978502+00	
00000000-0000-0000-0000-000000000000	8f69fc6a-d36e-461c-ba73-7ab00838843f	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-27 18:49:49.097779+00	
00000000-0000-0000-0000-000000000000	83ac31bb-9375-47e9-8b7f-006873c6e71b	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-27 18:49:49.112072+00	
00000000-0000-0000-0000-000000000000	b801ff5c-6fa1-48e9-8e04-077477473691	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-27 18:49:49.507738+00	
00000000-0000-0000-0000-000000000000	7c86f750-220a-484d-a54a-0541870daafd	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-02-27 18:49:49.508446+00	
00000000-0000-0000-0000-000000000000	62e19143-f4cd-4680-8a3a-55e193c2f08f	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-02 12:12:00.276477+00	
00000000-0000-0000-0000-000000000000	0f25abca-a749-46cf-b30c-529a141f8520	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-02 12:12:00.295551+00	
00000000-0000-0000-0000-000000000000	84ed6754-c194-4681-aaf9-7aa9cea248b3	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-02 14:21:19.042486+00	
00000000-0000-0000-0000-000000000000	6701d82d-22f6-4638-be8d-be74e82ff1e2	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-02 14:21:19.052716+00	
00000000-0000-0000-0000-000000000000	624a342c-5918-4cd1-bad1-3876a69fb4b4	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-02 15:33:42.872628+00	
00000000-0000-0000-0000-000000000000	0bef13b7-275d-4169-8aac-7754f0d6b05f	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-02 15:33:42.885789+00	
00000000-0000-0000-0000-000000000000	700abcae-e1e6-4e37-8e5a-c30dfb7326e8	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-03 12:16:28.383625+00	
00000000-0000-0000-0000-000000000000	776df1fc-ae14-44aa-80b5-5577e53784df	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-03 12:16:28.405962+00	
00000000-0000-0000-0000-000000000000	cea80f9a-8735-4010-8adf-1badc21874a0	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-03 13:24:16.278781+00	
00000000-0000-0000-0000-000000000000	81d188f9-a4ac-4f21-8050-f2c10a3cc2e2	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-03 13:24:16.285381+00	
00000000-0000-0000-0000-000000000000	01e7efca-eb4d-489a-957e-b30add505fbf	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-03 15:24:14.069526+00	
00000000-0000-0000-0000-000000000000	e1a622de-d6fb-46c5-bc37-f4ddb1737c01	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-03 15:24:14.082033+00	
00000000-0000-0000-0000-000000000000	03d312cd-c1e8-44d7-96f4-ae9133789709	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-03 17:34:03.457023+00	
00000000-0000-0000-0000-000000000000	0b47ff46-2112-4e5f-8b94-26058b2afe12	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-03 17:34:03.471076+00	
00000000-0000-0000-0000-000000000000	61ac28c8-7eb9-46b0-8f68-cfbd01c95cc2	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-04 12:08:27.355227+00	
00000000-0000-0000-0000-000000000000	5d6a877f-4f4f-4539-8a34-66a773ad0ae3	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-04 12:08:27.373202+00	
00000000-0000-0000-0000-000000000000	ee9b35c6-7b59-4580-b9fb-ba9e7296b7c3	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-04 13:11:36.020444+00	
00000000-0000-0000-0000-000000000000	6b743d94-bc5f-4499-97dd-a158c168005d	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-04 13:11:36.034591+00	
00000000-0000-0000-0000-000000000000	4751c0fe-3fef-4b74-b9f8-88e200db74d6	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-04 14:33:47.035484+00	
00000000-0000-0000-0000-000000000000	92964983-d150-4735-b8a2-ae0aca9e20f0	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-04 14:33:47.055733+00	
00000000-0000-0000-0000-000000000000	3fc74960-73e5-4b74-8239-62a098e083c9	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-04 20:04:13.727642+00	
00000000-0000-0000-0000-000000000000	31b3f477-2301-45f1-a6cf-20ce010c0bc4	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-04 20:04:13.74117+00	
00000000-0000-0000-0000-000000000000	c2e095d7-14e4-497f-9b81-dc3bab3e9fcf	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-04 20:04:47.220908+00	
00000000-0000-0000-0000-000000000000	307f3718-d58c-468c-9ae0-537642bdc37b	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-05 12:06:56.841314+00	
00000000-0000-0000-0000-000000000000	c64e1c33-64d1-4042-a841-76e7ed9485fd	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-05 12:06:56.864518+00	
00000000-0000-0000-0000-000000000000	963fc66c-26ff-44af-a885-7a47085901b1	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-05 13:16:27.310259+00	
00000000-0000-0000-0000-000000000000	d6668196-9745-443a-a071-faf8569a2151	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-05 13:16:27.327854+00	
00000000-0000-0000-0000-000000000000	634bfa17-a705-45ab-a010-333988aaee33	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-05 14:17:25.59061+00	
00000000-0000-0000-0000-000000000000	946fa9c9-629a-4949-a80b-85aed1a7a439	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-05 14:17:25.604292+00	
00000000-0000-0000-0000-000000000000	0fe7ec12-22cd-446c-b489-c27d0e2056b9	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-05 16:41:01.058704+00	
00000000-0000-0000-0000-000000000000	44f66788-9967-413d-ac3c-3aeb32ba7a30	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-05 16:41:01.070519+00	
00000000-0000-0000-0000-000000000000	83590bff-ab36-462f-80c6-3ebfab7e35ac	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-05 18:25:26.164698+00	
00000000-0000-0000-0000-000000000000	d6937de5-19d8-45ae-bb74-4e5629e3c4f3	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-05 18:25:26.173801+00	
00000000-0000-0000-0000-000000000000	4ed0137e-a854-4ab4-a5ad-5bb3bb20e6d2	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-05 19:58:05.66339+00	
00000000-0000-0000-0000-000000000000	b5712433-1a50-4c7d-9fa4-880299d01fa8	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-05 19:58:05.674874+00	
00000000-0000-0000-0000-000000000000	b364dcb9-947b-4c93-9bfe-bb78e6d3f12c	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-06 12:05:19.801863+00	
00000000-0000-0000-0000-000000000000	d33a12df-b169-47f8-ae4c-42823f2e5890	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-06 12:05:19.825324+00	
00000000-0000-0000-0000-000000000000	0d75fe58-0490-452f-98f3-246158a7566f	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-06 17:05:17.560781+00	
00000000-0000-0000-0000-000000000000	0f42fc71-ae56-42ac-a8a2-4a0e349e908d	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-06 17:05:17.572598+00	
00000000-0000-0000-0000-000000000000	afd3cdea-5ff0-4a91-9cba-897bd3948d99	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-09 12:06:44.782893+00	
00000000-0000-0000-0000-000000000000	ddaf840a-3c85-4d80-aac7-3ce1fe507cca	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-09 12:06:44.804922+00	
00000000-0000-0000-0000-000000000000	5739f4c3-f939-49ad-9b09-9ca06f48d96a	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-09 12:44:36.591381+00	
00000000-0000-0000-0000-000000000000	59f5d98e-396f-4638-b9e2-e5ecdb011687	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-09 13:28:52.942073+00	
00000000-0000-0000-0000-000000000000	8604b19c-23f7-4ba8-bfaf-63e081acda99	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-09 13:28:52.95973+00	
00000000-0000-0000-0000-000000000000	f67ac887-3408-4ae9-a6b6-373bffe871f3	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-09 13:42:53.664608+00	
00000000-0000-0000-0000-000000000000	9da6ff45-216b-438b-8255-ee83114eea81	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-09 13:42:53.676328+00	
00000000-0000-0000-0000-000000000000	edd3249b-ffce-418e-a0bc-e05d27cbbdc4	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-09 13:51:03.607377+00	
00000000-0000-0000-0000-000000000000	044f2a86-4770-4125-a36e-4ce54a656e8c	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-09 13:51:03.609036+00	
00000000-0000-0000-0000-000000000000	d57b30d2-d61b-484f-aa3f-8ced707894b0	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-09 13:51:19.160358+00	
00000000-0000-0000-0000-000000000000	0b6471ee-dace-45ae-aace-ade541aa2185	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-09 13:53:17.226553+00	
00000000-0000-0000-0000-000000000000	d0a02fb7-482f-4b7f-acb2-f5a54a43786b	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-03-09 14:21:36.276364+00	
00000000-0000-0000-0000-000000000000	785e0f14-97e7-4467-9913-14a28dd69271	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-09 14:22:15.751733+00	
00000000-0000-0000-0000-000000000000	65afa9e8-de2e-4dfb-a918-757d7146c84c	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"silvalidi925@gmail.com","user_id":"07746883-4d75-47f4-923c-0a4b8a3c6bc9","user_phone":""}}	2026-03-09 14:25:04.601089+00	
00000000-0000-0000-0000-000000000000	bbbef00d-ed07-4ca0-9fbb-f91be743afdf	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"cassiafernanda344@gmail.com","user_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","user_phone":""}}	2026-03-09 14:25:48.916996+00	
00000000-0000-0000-0000-000000000000	91a24600-00d6-47a7-afd2-83c19477f010	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"endrywgabrielx@gmail.com","user_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","user_phone":""}}	2026-03-09 14:28:18.456482+00	
00000000-0000-0000-0000-000000000000	efa598b2-5256-4e7c-9a92-a0d11249a291	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"ariellekevillynsantanna@gmail.com","user_id":"78685af2-5b9b-4cb6-99ce-ac7d72251adb","user_phone":""}}	2026-03-09 14:28:41.891534+00	
00000000-0000-0000-0000-000000000000	d43c3dbe-f370-4415-be07-62916688b6f4	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-03-09 14:28:51.630266+00	
00000000-0000-0000-0000-000000000000	1ed3112b-5eec-43e4-968b-a413f335f10a	{"action":"login","actor_id":"78685af2-5b9b-4cb6-99ce-ac7d72251adb","actor_username":"ariellekevillynsantanna@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-09 14:28:54.989768+00	
00000000-0000-0000-0000-000000000000	6bd0b79b-0c83-4a1a-94ef-c95dc7b19408	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-09 14:34:25.579669+00	
00000000-0000-0000-0000-000000000000	e9956dea-7819-45a6-97cf-9f12a26ae7cc	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-09 14:34:25.587211+00	
00000000-0000-0000-0000-000000000000	4f2c7bfd-ec01-4698-bebf-6b740d75819e	{"action":"login","actor_id":"78685af2-5b9b-4cb6-99ce-ac7d72251adb","actor_username":"ariellekevillynsantanna@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-09 14:52:35.835905+00	
00000000-0000-0000-0000-000000000000	b5400169-f01c-4410-9fea-3549d25db8e1	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-09 14:56:25.75496+00	
00000000-0000-0000-0000-000000000000	041fa20e-2cb2-42bb-8066-7a33e9f76701	{"action":"login","actor_id":"07746883-4d75-47f4-923c-0a4b8a3c6bc9","actor_username":"silvalidi925@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-09 14:56:35.122297+00	
00000000-0000-0000-0000-000000000000	ff9e4f10-c6d8-4649-9120-40be71be0190	{"action":"login","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-09 15:20:46.099588+00	
00000000-0000-0000-0000-000000000000	e12a8d42-b901-4c68-9e95-b44b007789d9	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-09 16:31:45.479913+00	
00000000-0000-0000-0000-000000000000	4c5abf38-59bd-47ff-9bce-adc0ee8818e8	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-09 16:31:45.493972+00	
00000000-0000-0000-0000-000000000000	a5710042-e811-4cc1-a17e-2aac2bf3384c	{"action":"token_refreshed","actor_id":"78685af2-5b9b-4cb6-99ce-ac7d72251adb","actor_username":"ariellekevillynsantanna@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-09 16:55:40.267461+00	
00000000-0000-0000-0000-000000000000	2fe94642-4c46-4c77-b708-232007d15547	{"action":"token_revoked","actor_id":"78685af2-5b9b-4cb6-99ce-ac7d72251adb","actor_username":"ariellekevillynsantanna@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-09 16:55:40.273934+00	
00000000-0000-0000-0000-000000000000	24e97d70-12e1-41bb-bf9c-0b946519f2ae	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-09 16:56:19.457888+00	
00000000-0000-0000-0000-000000000000	a9434744-e978-479c-be05-eee56be707d5	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-03-09 16:56:24.996123+00	
00000000-0000-0000-0000-000000000000	c6138285-cd66-43c8-a307-24d9c12af168	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-09 16:56:34.539012+00	
00000000-0000-0000-0000-000000000000	6939a25e-d9d2-40af-a298-1d1be1c62607	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-09 17:01:53.437985+00	
00000000-0000-0000-0000-000000000000	2b31246e-eb7b-478a-bd5a-5f88687ec477	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-09 17:02:02.743378+00	
00000000-0000-0000-0000-000000000000	862410f6-c2b9-4e01-b0cd-67aa0933bb6e	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-03-09 18:49:29.165913+00	
00000000-0000-0000-0000-000000000000	b9a289ea-80b3-45b9-b350-2cd30bf14ba9	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-03-09 18:49:29.177171+00	
00000000-0000-0000-0000-000000000000	0c585862-5c2c-4b37-85a8-bdae114b3f74	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-09 22:23:47.455969+00	
00000000-0000-0000-0000-000000000000	3b1c8948-50e3-4d95-a476-cbca3b29b254	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-10 12:17:21.427796+00	
00000000-0000-0000-0000-000000000000	62972a1c-ebee-4bc3-b1a1-971ee50775f9	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-10 12:17:21.449709+00	
00000000-0000-0000-0000-000000000000	03f638ae-d535-4325-8a0f-45313efac61c	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-10 13:32:41.879415+00	
00000000-0000-0000-0000-000000000000	11ea3662-53d5-48cc-bcb2-b964c163a0ef	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-10 13:32:41.888305+00	
00000000-0000-0000-0000-000000000000	71dd70df-7c6b-41ab-979e-8f27cc91020e	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-10 16:20:31.849743+00	
00000000-0000-0000-0000-000000000000	8ffed8fb-58ad-46ff-8a98-8287b1e1ba1c	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-10 16:20:31.860912+00	
00000000-0000-0000-0000-000000000000	b6785a72-5e05-445e-9525-346c570b1536	{"action":"token_refreshed","actor_id":"78685af2-5b9b-4cb6-99ce-ac7d72251adb","actor_username":"ariellekevillynsantanna@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-10 20:07:29.952303+00	
00000000-0000-0000-0000-000000000000	b272f2fe-d19e-45b3-9c7f-dc1d7a615df8	{"action":"token_revoked","actor_id":"78685af2-5b9b-4cb6-99ce-ac7d72251adb","actor_username":"ariellekevillynsantanna@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-10 20:07:29.964273+00	
00000000-0000-0000-0000-000000000000	393a364f-2ffb-4ee0-b98e-dd22337023d9	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-11 11:57:03.12669+00	
00000000-0000-0000-0000-000000000000	efc47a7d-719f-4415-be36-c86733fd644c	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-11 11:57:03.146519+00	
00000000-0000-0000-0000-000000000000	335280cb-9204-403c-825e-248a17b3d7fe	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-11 12:17:45.071612+00	
00000000-0000-0000-0000-000000000000	8fbfd990-5049-4de5-af59-c469509dd749	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-11 12:55:37.547524+00	
00000000-0000-0000-0000-000000000000	9eb1aede-717b-4f71-b11e-96242f7220d8	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-11 12:55:37.557822+00	
00000000-0000-0000-0000-000000000000	b27e00d3-a20e-4035-b5cd-7fcb966167df	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-11 14:13:30.895825+00	
00000000-0000-0000-0000-000000000000	ccd53782-94ff-4193-aa3f-eb75834c28b5	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-11 14:13:30.908327+00	
00000000-0000-0000-0000-000000000000	d5b19f18-6bcc-43d0-8a66-286ba3ff1d4c	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-11 15:15:27.522175+00	
00000000-0000-0000-0000-000000000000	02241954-c642-47a6-ac44-9510e2f26c16	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-11 15:15:27.532132+00	
00000000-0000-0000-0000-000000000000	fc7996a0-244a-4068-b3c4-4bcb4c1f1a6c	{"action":"token_refreshed","actor_id":"78685af2-5b9b-4cb6-99ce-ac7d72251adb","actor_username":"ariellekevillynsantanna@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-11 15:55:41.644984+00	
00000000-0000-0000-0000-000000000000	715c2af7-6c84-4392-8762-03c5fa260ea9	{"action":"token_revoked","actor_id":"78685af2-5b9b-4cb6-99ce-ac7d72251adb","actor_username":"ariellekevillynsantanna@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-11 15:55:41.649326+00	
00000000-0000-0000-0000-000000000000	f4b760a2-18ef-48cd-b61d-cff9cf639a82	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-11 16:28:47.353431+00	
00000000-0000-0000-0000-000000000000	768d3f1e-a356-44b1-b1f5-7c02590c3f35	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-11 16:28:47.36499+00	
00000000-0000-0000-0000-000000000000	927f127e-72e8-47cc-b27d-2b347a8ea5d5	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-11 21:58:10.738857+00	
00000000-0000-0000-0000-000000000000	a698a067-0769-4d51-8c93-ea80ba697465	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-11 21:58:10.750305+00	
00000000-0000-0000-0000-000000000000	eeef2d67-33c9-4190-a130-fa8182abe275	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-12 12:06:14.242047+00	
00000000-0000-0000-0000-000000000000	ea642ede-a6bd-4c77-8b6e-9ad721f26f99	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-12 12:06:14.264695+00	
00000000-0000-0000-0000-000000000000	835dfc97-d28d-4404-b6a5-ea9297863c26	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-12 13:21:17.668514+00	
00000000-0000-0000-0000-000000000000	04451114-29dc-498e-9924-53407bf05561	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-12 13:21:17.677532+00	
00000000-0000-0000-0000-000000000000	3a8b116d-526b-4003-b7fb-aa303eb67534	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-12 14:24:17.840913+00	
00000000-0000-0000-0000-000000000000	9f6cb51e-c758-447d-9a38-6f5708bc6312	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-12 14:24:17.850143+00	
00000000-0000-0000-0000-000000000000	bf31cb4e-3a33-424a-8b6f-63da86a2b894	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-12 15:31:08.531489+00	
00000000-0000-0000-0000-000000000000	1f2a8515-aaae-4486-9107-34c7a917ac43	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-12 15:31:08.545547+00	
00000000-0000-0000-0000-000000000000	8951184b-cfa7-4b15-87d9-788549fea82e	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-12 16:55:57.104399+00	
00000000-0000-0000-0000-000000000000	e2306c65-862a-4a5d-be9a-9bb321ffcc18	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-12 16:55:57.120899+00	
00000000-0000-0000-0000-000000000000	493a2246-70c5-408c-ae9b-67d4f411f209	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-13 12:05:41.623734+00	
00000000-0000-0000-0000-000000000000	667e9910-d048-4556-a017-c719d7c1b87d	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-13 12:05:41.643516+00	
00000000-0000-0000-0000-000000000000	eaba79a2-faba-41f2-a801-96148c999ef7	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-13 13:13:45.599764+00	
00000000-0000-0000-0000-000000000000	2328ea06-7603-484a-a6c5-225e8f953b74	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-13 13:13:45.611411+00	
00000000-0000-0000-0000-000000000000	a15860d5-2fa6-4b66-9ed6-b38c356903d4	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-13 14:12:13.96731+00	
00000000-0000-0000-0000-000000000000	f99b440b-3705-44f3-8add-9a4ddc20355d	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-13 14:12:13.975085+00	
00000000-0000-0000-0000-000000000000	a626b52e-d5eb-4382-baf3-8beb0eb28c0f	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-13 15:15:37.921394+00	
00000000-0000-0000-0000-000000000000	4f72c517-acea-4f5f-bb4e-710f0fbc806a	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-13 15:15:37.936072+00	
00000000-0000-0000-0000-000000000000	96920f35-6f40-4f78-b69c-7ec1a56f8934	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-13 16:17:20.522151+00	
00000000-0000-0000-0000-000000000000	c4027b75-c442-4e34-a859-4f9a003a6a52	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-13 16:21:23.83109+00	
00000000-0000-0000-0000-000000000000	1a4d3221-5622-486b-aad9-e827512b4272	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-13 16:21:23.833931+00	
00000000-0000-0000-0000-000000000000	09da6644-5f08-461d-9f50-7dc8549da2be	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-16 12:24:17.25184+00	
00000000-0000-0000-0000-000000000000	2e49b09e-94c7-46bd-9bef-489272670f84	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-16 12:24:17.272649+00	
00000000-0000-0000-0000-000000000000	02086618-2b1b-4622-9bbf-cc791c0d4148	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-16 14:17:10.646328+00	
00000000-0000-0000-0000-000000000000	b4eb7942-5ec6-4ed2-953c-8e6f09f10136	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-16 14:17:10.659427+00	
00000000-0000-0000-0000-000000000000	bc43cedb-3d7b-48a2-9aac-018ccce7e624	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-16 15:15:13.708695+00	
00000000-0000-0000-0000-000000000000	4e85a431-e18d-41f7-a28d-526b35d68e05	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-16 15:15:13.717773+00	
00000000-0000-0000-0000-000000000000	1b08d836-b77c-47eb-90f9-2ccaceb8f138	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-17 12:02:05.663864+00	
00000000-0000-0000-0000-000000000000	7e53833c-f711-462d-a319-4a998c69363a	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-17 12:02:05.686483+00	
00000000-0000-0000-0000-000000000000	34c42da1-b32a-4a93-8ab0-e6ebac15eaab	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-17 13:18:04.77496+00	
00000000-0000-0000-0000-000000000000	e06366e5-4306-4c0b-a0f7-a54f94f506b3	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-17 13:18:04.78265+00	
00000000-0000-0000-0000-000000000000	87f921b2-a7eb-4450-8809-e5a76d7dc214	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-17 14:16:33.689301+00	
00000000-0000-0000-0000-000000000000	7f5f5305-7e82-4c27-90c8-bb40348f5ea8	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-17 14:16:33.698808+00	
00000000-0000-0000-0000-000000000000	c595ad62-1778-4f0b-bf60-70c9e941854e	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-17 15:54:20.320684+00	
00000000-0000-0000-0000-000000000000	50bcc066-e10c-458b-8e0a-f1950582369c	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-17 15:54:20.333468+00	
00000000-0000-0000-0000-000000000000	6810fcb7-ac79-4580-8e63-4e38f61d45d1	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-17 18:01:27.341797+00	
00000000-0000-0000-0000-000000000000	8afcfc88-3b91-4538-9219-d293142366ca	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-17 18:01:27.352301+00	
00000000-0000-0000-0000-000000000000	6cd3d155-6285-4e67-8366-a732210e3330	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-18 12:08:03.013618+00	
00000000-0000-0000-0000-000000000000	400d0d47-9aa9-4558-9109-76b271131b03	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-18 12:08:03.038887+00	
00000000-0000-0000-0000-000000000000	b47033b3-93a3-4c91-8fb6-f4278c59bb6d	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-18 13:16:36.39706+00	
00000000-0000-0000-0000-000000000000	72d9ba17-fad9-4d11-b463-58279faf67b9	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-18 13:16:36.408124+00	
00000000-0000-0000-0000-000000000000	7089fe15-1d9f-4925-a41b-13705164f7f9	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-18 15:31:37.171814+00	
00000000-0000-0000-0000-000000000000	c93bd1a2-1552-4af0-b723-bb2dc067608e	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-18 15:31:37.18675+00	
00000000-0000-0000-0000-000000000000	08a2a816-b8e2-4c5d-801d-006605644d70	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-18 16:43:33.574972+00	
00000000-0000-0000-0000-000000000000	b5893493-5830-46c9-a479-9baaa09d4a47	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-18 16:43:33.592413+00	
00000000-0000-0000-0000-000000000000	f2959138-a61a-4513-94f6-5a17eef8cd05	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-18 17:47:33.641755+00	
00000000-0000-0000-0000-000000000000	888b3fea-28e2-461f-9323-55ae3e823b62	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-18 17:47:33.65343+00	
00000000-0000-0000-0000-000000000000	d4b3cc15-d3c6-4f3a-bf40-56b6586353b7	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-19 12:17:18.179791+00	
00000000-0000-0000-0000-000000000000	b83efc5b-355d-405d-a81d-dd9983bae917	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-19 12:17:18.202583+00	
00000000-0000-0000-0000-000000000000	4d0ddf6b-a6bf-440c-9781-f48f94fe274f	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-19 13:59:45.540557+00	
00000000-0000-0000-0000-000000000000	8cca2761-e684-4319-aa18-04a739905086	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-19 13:59:45.552098+00	
00000000-0000-0000-0000-000000000000	bcf3ae33-54c2-4d1b-82c7-88e0d2023471	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-19 14:58:12.820928+00	
00000000-0000-0000-0000-000000000000	1fb5a5c3-6ec5-4890-832c-d82a9ce51abe	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-19 14:58:12.829355+00	
00000000-0000-0000-0000-000000000000	d96540ae-3246-4ddd-ac3f-edd7ab00c64f	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-19 15:59:22.471665+00	
00000000-0000-0000-0000-000000000000	8bf93175-9436-4dbf-82f8-3915a095b709	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-19 15:59:22.483896+00	
00000000-0000-0000-0000-000000000000	b878d3e6-5277-4c29-a9ac-2a7cdebb7ed5	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-19 16:13:59.608314+00	
00000000-0000-0000-0000-000000000000	ee2789c5-5c20-4e82-b14f-6c99f90d4cac	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-19 17:13:57.036372+00	
00000000-0000-0000-0000-000000000000	507c5ea2-789d-411b-9999-b93830b4c66a	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-19 17:13:57.046739+00	
00000000-0000-0000-0000-000000000000	3249beb2-4454-4162-8fda-f561842bd5d5	{"action":"token_refreshed","actor_id":"78685af2-5b9b-4cb6-99ce-ac7d72251adb","actor_username":"ariellekevillynsantanna@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-19 18:30:53.314189+00	
00000000-0000-0000-0000-000000000000	8d97f570-30be-4f06-9725-bf649e0e34c7	{"action":"token_revoked","actor_id":"78685af2-5b9b-4cb6-99ce-ac7d72251adb","actor_username":"ariellekevillynsantanna@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-19 18:30:53.326542+00	
00000000-0000-0000-0000-000000000000	1831f61c-d83a-4292-b89b-9ba2ab777ee2	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-03-19 19:08:43.292942+00	
00000000-0000-0000-0000-000000000000	68054a6f-fda4-47ea-8e0a-9b3ec5f7887a	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-03-19 19:08:43.311357+00	
00000000-0000-0000-0000-000000000000	3c335dbe-c82c-4eb9-914e-95f2fc032cc9	{"action":"token_refreshed","actor_id":"78685af2-5b9b-4cb6-99ce-ac7d72251adb","actor_username":"ariellekevillynsantanna@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-19 19:28:54.027882+00	
00000000-0000-0000-0000-000000000000	cc8a6db7-739d-49fd-80d5-e9113e542353	{"action":"token_revoked","actor_id":"78685af2-5b9b-4cb6-99ce-ac7d72251adb","actor_username":"ariellekevillynsantanna@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-19 19:28:54.035064+00	
00000000-0000-0000-0000-000000000000	f2a20863-f338-434e-9d28-2a5df6368f0e	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-03-19 19:37:59.554684+00	
00000000-0000-0000-0000-000000000000	6ec44267-6bcf-4b52-8b89-32d9d2acf551	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-03-19 19:37:59.559108+00	
00000000-0000-0000-0000-000000000000	d1663c25-bf32-457c-8d26-ce630d5e0982	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-20 11:57:12.774941+00	
00000000-0000-0000-0000-000000000000	66bee301-ccf4-462e-83b3-230692e0b155	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-20 11:57:12.793423+00	
00000000-0000-0000-0000-000000000000	eb600105-7922-4399-bf10-b5abc7f230d8	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-03-20 12:36:54.899483+00	
00000000-0000-0000-0000-000000000000	ed8c4473-139b-4542-a952-8927add2f5f2	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-03-20 12:36:54.905713+00	
00000000-0000-0000-0000-000000000000	fc9df96a-aa4a-4168-911c-7f8869eb2546	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-20 13:01:37.68451+00	
00000000-0000-0000-0000-000000000000	5cd6539f-f8f9-446c-8074-031c32082387	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-20 13:01:37.704882+00	
00000000-0000-0000-0000-000000000000	6138fc09-893b-4aab-a424-bf698476ed4c	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-20 14:29:23.423667+00	
00000000-0000-0000-0000-000000000000	0e671059-f827-4af7-bc3b-8497106254ad	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-20 14:29:23.444101+00	
00000000-0000-0000-0000-000000000000	23d8d130-9997-4fdc-b9ba-260a4273a124	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-03-20 14:30:30.058525+00	
00000000-0000-0000-0000-000000000000	fcccd647-1d6a-4da3-bc11-fe2709fc90af	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-03-20 14:30:30.060559+00	
00000000-0000-0000-0000-000000000000	6c9bf5f0-4a9c-4039-8fc3-c5f7c458cc61	{"action":"token_refreshed","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-20 14:49:37.295826+00	
00000000-0000-0000-0000-000000000000	b23d4f46-3142-41b0-81df-e85f5e9e4eea	{"action":"token_revoked","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-20 14:49:37.313208+00	
00000000-0000-0000-0000-000000000000	ff0a0f0a-2026-4554-bc56-9ac8189352da	{"action":"token_refreshed","actor_id":"07746883-4d75-47f4-923c-0a4b8a3c6bc9","actor_username":"silvalidi925@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-20 14:50:17.44314+00	
00000000-0000-0000-0000-000000000000	49cfb002-d7d0-4250-b14f-ae624c8b052c	{"action":"token_revoked","actor_id":"07746883-4d75-47f4-923c-0a4b8a3c6bc9","actor_username":"silvalidi925@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-20 14:50:17.444189+00	
00000000-0000-0000-0000-000000000000	fbab562a-cee4-4c85-a57a-3c3392e3cf30	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-20 15:27:44.372929+00	
00000000-0000-0000-0000-000000000000	ae5aed95-a96f-42e7-9ef9-c2ea74046982	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-20 15:27:44.393834+00	
00000000-0000-0000-0000-000000000000	6a76ab19-527a-47e4-9bbd-df75b630dd0a	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-23 12:05:54.536671+00	
00000000-0000-0000-0000-000000000000	26f5f3f4-f2b6-489a-a320-63c28a86a69a	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-23 12:05:54.556801+00	
00000000-0000-0000-0000-000000000000	df22c206-82a2-42e3-8136-86e7da1f652a	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-23 15:08:58.662413+00	
00000000-0000-0000-0000-000000000000	f51b2bda-eeae-4128-b40e-396221182f98	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-23 15:08:58.681358+00	
00000000-0000-0000-0000-000000000000	21852a27-0d7c-4558-9357-cb96308a71e1	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-23 17:09:24.040424+00	
00000000-0000-0000-0000-000000000000	ad5d10ba-24d2-43c6-8fb9-7fd99c9751fa	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-23 17:09:24.054427+00	
00000000-0000-0000-0000-000000000000	1c3ea0c7-d252-4065-9607-52bdb37c36a6	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-24 12:12:11.046314+00	
00000000-0000-0000-0000-000000000000	adda6ad2-4b2f-4e90-94b9-d37c7aaba5b4	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-24 12:12:11.064706+00	
00000000-0000-0000-0000-000000000000	dde42840-01e1-469e-b8c0-e86b83bf58ec	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-24 13:25:23.904375+00	
00000000-0000-0000-0000-000000000000	a27d2168-1e37-49be-ae04-e3d54a6046e9	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-24 13:25:23.923214+00	
00000000-0000-0000-0000-000000000000	59557016-2db3-4e11-943e-a8f6d0df335b	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-24 14:40:59.96461+00	
00000000-0000-0000-0000-000000000000	b83ab443-904d-4830-84b7-b4ff32e5f6e8	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-24 14:40:59.9769+00	
00000000-0000-0000-0000-000000000000	9e810543-bd40-4814-b5dd-7f01f179097a	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-24 16:03:06.59527+00	
00000000-0000-0000-0000-000000000000	f6f3e7c8-084b-4742-8e42-39fef4c3455e	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-24 16:03:06.614084+00	
00000000-0000-0000-0000-000000000000	ac404e58-f58b-4158-84f1-3de0e0c6e304	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-25 12:18:41.368399+00	
00000000-0000-0000-0000-000000000000	097dac48-a3e2-45b9-b101-c3238faa8efd	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-25 12:18:41.393725+00	
00000000-0000-0000-0000-000000000000	58d60a53-4306-431d-bc39-6e46445fd5f1	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-25 14:27:42.438433+00	
00000000-0000-0000-0000-000000000000	06e3e9b9-43b8-479f-9b64-82194910b09c	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-25 14:27:42.450122+00	
00000000-0000-0000-0000-000000000000	9c940a54-a2b3-456d-8083-fe490037ff8e	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-25 16:46:36.746361+00	
00000000-0000-0000-0000-000000000000	b0a73b35-d93b-4cdc-b10e-917751395e98	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-25 16:46:36.761573+00	
00000000-0000-0000-0000-000000000000	61c245c1-3a1c-4f33-9ef9-17c97dac3db2	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-26 12:10:58.507862+00	
00000000-0000-0000-0000-000000000000	a3f36547-9b3c-49c3-a06c-55fd9ccb69d3	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-26 12:10:58.532289+00	
00000000-0000-0000-0000-000000000000	c35b22de-4740-45ea-b541-f6934f9147f3	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-26 13:11:32.495562+00	
00000000-0000-0000-0000-000000000000	b167622f-1cf6-4012-8584-f98d6160ccc6	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-26 13:11:32.509805+00	
00000000-0000-0000-0000-000000000000	fb164242-5fb6-429d-b89e-afa6eb230e77	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-26 14:19:21.723304+00	
00000000-0000-0000-0000-000000000000	3428bf95-ee7e-4d18-b416-d34c0b3a8697	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-26 14:19:21.738949+00	
00000000-0000-0000-0000-000000000000	d14154a3-487e-41d6-94f0-241261209113	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-26 15:28:09.386341+00	
00000000-0000-0000-0000-000000000000	83f3faba-e9cd-4a16-9050-adcd1df6ac51	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-26 15:28:09.400933+00	
00000000-0000-0000-0000-000000000000	41dd8803-a7b9-4089-a624-18776225cabb	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-26 16:33:00.322018+00	
00000000-0000-0000-0000-000000000000	3c113161-c90c-4bfd-8416-8992814f3482	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-26 16:33:00.334344+00	
00000000-0000-0000-0000-000000000000	528e0401-3155-4ce4-b264-ff212accd363	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-27 12:08:30.847886+00	
00000000-0000-0000-0000-000000000000	4cd25395-1c99-4324-9aa9-0d8bb5c2ec1f	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-27 12:08:30.873137+00	
00000000-0000-0000-0000-000000000000	604acd99-2fe5-43d1-beb9-5dc190800ac4	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-27 13:06:50.605967+00	
00000000-0000-0000-0000-000000000000	fa673b1b-d667-49d4-8f79-abe16b98b2f0	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-27 13:06:50.623506+00	
00000000-0000-0000-0000-000000000000	3d591f8e-8dfe-4357-8714-0d341eadcc98	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-27 14:06:10.791894+00	
00000000-0000-0000-0000-000000000000	0b0ba88f-ddef-428f-8561-48beac81e06a	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-27 14:06:10.800216+00	
00000000-0000-0000-0000-000000000000	8b61800f-76e7-4dd7-b636-a48726012ee2	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-27 15:05:55.075545+00	
00000000-0000-0000-0000-000000000000	730b221b-14ea-42ea-94f9-33ee6d190359	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-27 15:05:55.082392+00	
00000000-0000-0000-0000-000000000000	1ccca471-c0d1-4249-95ab-1e867d1bbae7	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-27 16:15:45.782882+00	
00000000-0000-0000-0000-000000000000	1c26df7b-afa0-4002-b7df-c530eb5cfe95	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-27 16:15:45.797036+00	
00000000-0000-0000-0000-000000000000	052b71e0-51e0-4430-829a-b09150b0ac0c	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-27 17:38:45.804963+00	
00000000-0000-0000-0000-000000000000	e563f702-25d4-41b2-9b59-d06f5811e77f	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-27 17:38:45.818695+00	
00000000-0000-0000-0000-000000000000	dc750089-8a73-4414-ae82-3be2bf4a8335	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-03-28 19:32:14.951645+00	
00000000-0000-0000-0000-000000000000	44c24964-0156-41d6-8802-736198a779d2	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-03-28 19:32:14.979281+00	
00000000-0000-0000-0000-000000000000	7d0f7c2e-20c0-49e5-8ec3-6538269ce216	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-30 12:02:38.216277+00	
00000000-0000-0000-0000-000000000000	3dd037ff-7dc5-4725-a018-9ccecdf7328a	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-30 12:02:38.2452+00	
00000000-0000-0000-0000-000000000000	914ebd34-1b19-4f0f-9640-2a093ecfa6d0	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-30 13:00:54.674712+00	
00000000-0000-0000-0000-000000000000	3dcffc02-60ee-4ed5-9477-03d0bc0decff	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-30 13:00:54.685964+00	
00000000-0000-0000-0000-000000000000	cbe5e275-ee6b-47c0-aeb3-4605cca12b72	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-30 14:09:40.854876+00	
00000000-0000-0000-0000-000000000000	e46a5e5c-afa4-4c5d-813a-c86409fbec97	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-30 14:09:40.866065+00	
00000000-0000-0000-0000-000000000000	6f2bf268-d632-4fc7-8d1b-f53607b8b284	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-30 15:09:44.268717+00	
00000000-0000-0000-0000-000000000000	bca0486e-7022-43c3-98b3-8ee55769371c	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-30 15:09:44.282191+00	
00000000-0000-0000-0000-000000000000	3d44c03b-e812-4bb7-a679-b521d64e3ac1	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-30 16:13:34.042826+00	
00000000-0000-0000-0000-000000000000	4317e6bf-4059-4cd5-9690-7eaca3ae7104	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-30 16:13:34.053895+00	
00000000-0000-0000-0000-000000000000	2e2d8342-9ab8-4b45-b418-0b092dcce597	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-30 17:52:34.12986+00	
00000000-0000-0000-0000-000000000000	1ff25ec9-6663-4e8a-9803-4243b615e7a0	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-30 17:52:34.141818+00	
00000000-0000-0000-0000-000000000000	ee972acf-83e1-42ae-aa8e-31517164a20b	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-31 12:15:59.514563+00	
00000000-0000-0000-0000-000000000000	de9c2cc8-8b51-4fe1-a016-d19ca4b3a28c	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-31 12:15:59.540669+00	
00000000-0000-0000-0000-000000000000	4e630b62-57d9-4947-8ed0-75c0a045eae3	{"action":"token_refreshed","actor_id":"78685af2-5b9b-4cb6-99ce-ac7d72251adb","actor_username":"ariellekevillynsantanna@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-31 12:26:24.681794+00	
00000000-0000-0000-0000-000000000000	2218b014-b416-4b70-ab72-1af621b4eaee	{"action":"token_revoked","actor_id":"78685af2-5b9b-4cb6-99ce-ac7d72251adb","actor_username":"ariellekevillynsantanna@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-31 12:26:24.6941+00	
00000000-0000-0000-0000-000000000000	58bd255f-72a3-42da-a494-7841e9917d36	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"silvalidi925@gmail.com","user_id":"07746883-4d75-47f4-923c-0a4b8a3c6bc9","user_phone":""}}	2026-03-31 12:56:06.243809+00	
00000000-0000-0000-0000-000000000000	04b879a5-65dc-48d2-8c64-30ebfb96e6f3	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"ariellekevillynsantanna@gmail.com","user_id":"78685af2-5b9b-4cb6-99ce-ac7d72251adb","user_phone":""}}	2026-03-31 12:56:06.446966+00	
00000000-0000-0000-0000-000000000000	0a64238d-6e23-42da-8827-ed04e46eb3ed	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-03-31 12:56:36.032167+00	
00000000-0000-0000-0000-000000000000	8f2da02f-5bb9-491d-beaf-75074a584d9e	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-03-31 12:56:36.038615+00	
00000000-0000-0000-0000-000000000000	109db76d-165b-437a-a4d0-7b6415e94898	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-31 13:30:10.964472+00	
00000000-0000-0000-0000-000000000000	590b9bb4-fd14-44af-8796-192bc5d38283	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-31 13:30:10.981571+00	
00000000-0000-0000-0000-000000000000	1e0fbe55-9ac4-46d4-96b0-5c62e1c125a2	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-03-31 13:35:36.917531+00	
00000000-0000-0000-0000-000000000000	59c7d755-388c-4830-a062-94281c2d3552	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-31 14:51:25.169718+00	
00000000-0000-0000-0000-000000000000	15bf2984-19e7-4c66-8b07-be7c546712c0	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-31 14:51:25.185479+00	
00000000-0000-0000-0000-000000000000	785a081c-50eb-4263-a299-ad5f9e430cd8	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-31 15:58:25.737422+00	
00000000-0000-0000-0000-000000000000	619ec634-4d25-4f0f-8604-225175c8d8c1	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-31 15:58:25.743893+00	
00000000-0000-0000-0000-000000000000	3db0bd91-95d0-4e7a-909a-a18f69113190	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-31 17:00:38.038595+00	
00000000-0000-0000-0000-000000000000	752cab70-2fea-4598-a4b8-460a30aa3245	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-03-31 17:00:38.049595+00	
00000000-0000-0000-0000-000000000000	b0a8fc3a-6326-4b05-b569-d248b6103897	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-01 12:11:55.354675+00	
00000000-0000-0000-0000-000000000000	6e192fc8-1fd8-47bb-85ec-e2eebfdf040e	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-01 12:11:55.375312+00	
00000000-0000-0000-0000-000000000000	6fff6bbc-b1bd-4527-951c-07e219c8989f	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-01 14:06:32.509031+00	
00000000-0000-0000-0000-000000000000	7f231fae-c112-48a2-9317-ef66d38b8bef	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-01 14:06:32.521727+00	
00000000-0000-0000-0000-000000000000	f793ba05-6ce6-49d3-8a0c-f65226f93467	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-01 15:06:11.732094+00	
00000000-0000-0000-0000-000000000000	8dafcfe8-d6c9-4523-8801-fd1b5937d6db	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-01 15:06:11.742386+00	
00000000-0000-0000-0000-000000000000	4d5d732d-491e-4665-a31f-1a2308a08a20	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-02 11:56:57.68803+00	
00000000-0000-0000-0000-000000000000	c88dd98f-2251-410c-9871-54ab05a9fa25	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-02 11:56:57.71431+00	
00000000-0000-0000-0000-000000000000	462d253d-6a21-413a-adba-5a5d86f8cad9	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-02 12:55:15.71677+00	
00000000-0000-0000-0000-000000000000	de09313d-7c04-4b3e-9ad8-4746235ef5d4	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-02 12:55:15.730508+00	
00000000-0000-0000-0000-000000000000	4155f3dc-8d60-47ca-b011-cfa1f0879642	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-02 14:14:25.287659+00	
00000000-0000-0000-0000-000000000000	4ea2a4e0-c16b-4dd4-bd5a-0868e7a15445	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-02 14:14:25.29685+00	
00000000-0000-0000-0000-000000000000	8ef3c998-9227-410c-9078-5b163895e11e	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-02 19:50:45.946787+00	
00000000-0000-0000-0000-000000000000	20c0d2a5-48f5-4908-9bd5-f6dbb42f2c9b	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-02 19:50:45.969518+00	
00000000-0000-0000-0000-000000000000	3b4acf52-b9b3-46ca-aeda-c6d5bf45b448	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-06 11:55:11.153002+00	
00000000-0000-0000-0000-000000000000	bd42271b-f652-4230-b46d-632ba83b4796	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-06 11:55:11.174776+00	
00000000-0000-0000-0000-000000000000	f4ccc675-7807-4fff-9694-e35b8576ffa2	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-06 13:26:19.695736+00	
00000000-0000-0000-0000-000000000000	500957cf-37aa-4182-bf16-e4aa4a82e102	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-06 13:26:19.702849+00	
00000000-0000-0000-0000-000000000000	093586cd-bb80-44ba-9bba-5cd76ffe4320	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-06 14:29:15.430208+00	
00000000-0000-0000-0000-000000000000	b534747d-deed-4cf8-bef6-a0587931eb61	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-06 14:29:15.440561+00	
00000000-0000-0000-0000-000000000000	a3c74650-243a-401a-99cd-bfd670544969	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-06 16:19:03.508824+00	
00000000-0000-0000-0000-000000000000	e7c021df-3773-48e1-a733-2ce781ebd763	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-06 16:19:03.520086+00	
00000000-0000-0000-0000-000000000000	6012de5c-b092-49af-894e-a1df0cd08edd	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-07 12:05:03.504825+00	
00000000-0000-0000-0000-000000000000	743fe273-f661-4377-968c-c0af5c9283f6	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-07 12:05:03.527804+00	
00000000-0000-0000-0000-000000000000	51fc10bc-35af-4187-ae2a-0cf4f825803d	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-07 13:24:19.223372+00	
00000000-0000-0000-0000-000000000000	158b94f3-86d0-46ca-9a0d-c8b5bc6235e4	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-07 13:24:19.235502+00	
00000000-0000-0000-0000-000000000000	1ab6fcce-e813-467c-a8f0-3ea91ef90bf4	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-07 14:33:48.150825+00	
00000000-0000-0000-0000-000000000000	3de4714d-3fbc-48c5-b3c5-f0d9375fda1b	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-07 14:33:48.164488+00	
00000000-0000-0000-0000-000000000000	128fb2c2-3021-4f63-a22f-6d27e65b45b0	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-07 15:34:40.12357+00	
00000000-0000-0000-0000-000000000000	eee12f22-c0f2-44c7-88b7-ccb3787ef454	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-07 15:34:40.138349+00	
00000000-0000-0000-0000-000000000000	c06c3319-776e-4eea-a03f-cb5f2ef23e25	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-07 17:06:22.357578+00	
00000000-0000-0000-0000-000000000000	5ba2d318-a211-4a92-90c5-4854f96c4c56	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-07 17:06:22.372599+00	
00000000-0000-0000-0000-000000000000	9c1c00f9-8c30-47e3-97a4-199df9c45c38	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-08 12:09:00.317441+00	
00000000-0000-0000-0000-000000000000	f12cd8e5-a53b-4aac-8411-8c4bfe4aa13b	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-08 12:09:00.340486+00	
00000000-0000-0000-0000-000000000000	dc1166b3-f6e1-470e-bb86-d2ffceacf62e	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-08 13:40:38.252699+00	
00000000-0000-0000-0000-000000000000	566bede9-80d5-41a0-b96d-4522cc8fe188	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-08 13:40:38.262893+00	
00000000-0000-0000-0000-000000000000	a0970b12-3d6f-44d3-9a93-1277381d693a	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-08 15:02:03.56085+00	
00000000-0000-0000-0000-000000000000	3481bfb7-0e01-4608-a7fb-4507cc7cbe93	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-08 15:02:03.566986+00	
00000000-0000-0000-0000-000000000000	a2d6ccd0-dce6-4942-b4b9-cd7ded8d5509	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-08 16:04:08.081411+00	
00000000-0000-0000-0000-000000000000	780bcace-905b-4f78-afea-a397229004fb	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-08 16:04:08.089498+00	
00000000-0000-0000-0000-000000000000	3eb3966e-3cd6-4134-a01d-4e902932bb39	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-09 12:11:42.971668+00	
00000000-0000-0000-0000-000000000000	37b18c05-924e-4ce9-9d3d-8b36d7d0d965	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-09 12:11:42.998153+00	
00000000-0000-0000-0000-000000000000	898c7cfd-455e-4886-b53f-4664a78cb49d	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-09 13:09:52.028148+00	
00000000-0000-0000-0000-000000000000	a36961c0-c131-47b6-8662-6ebd17c1a1db	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-09 13:09:52.049909+00	
00000000-0000-0000-0000-000000000000	ad69cfff-0a71-4591-b147-95df854e20d8	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-09 14:44:06.303889+00	
00000000-0000-0000-0000-000000000000	69f2b162-c43c-44aa-8d7d-1810bc2755c9	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-09 14:44:06.317721+00	
00000000-0000-0000-0000-000000000000	61832be1-5739-4e29-9451-8ce05879d10e	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-09 15:54:07.7273+00	
00000000-0000-0000-0000-000000000000	278208f1-7053-460f-8374-f494363d9975	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-09 15:54:07.737592+00	
00000000-0000-0000-0000-000000000000	72c9483f-58e0-495f-84b1-039c6bbfda3b	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-10 12:09:05.17851+00	
00000000-0000-0000-0000-000000000000	74c7abd1-ace6-423a-8d3b-dbcbb13172eb	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-10 12:09:05.200638+00	
00000000-0000-0000-0000-000000000000	8c716dc0-2efc-4144-8a08-16bec8fb5d4d	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-10 13:47:30.163045+00	
00000000-0000-0000-0000-000000000000	21c40de9-e4d9-481b-8222-bf2e51cd46b7	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-10 13:47:30.182985+00	
00000000-0000-0000-0000-000000000000	9454015a-9338-4363-a16d-4a3cda4ea2aa	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-10 14:58:40.886768+00	
00000000-0000-0000-0000-000000000000	2ccfd0e7-760e-43a6-afbb-5d559a2c4c02	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-10 14:58:40.896571+00	
00000000-0000-0000-0000-000000000000	21487308-1f6f-4540-ae32-18632d8a5ace	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-10 16:27:28.546615+00	
00000000-0000-0000-0000-000000000000	d838afa3-e863-47d5-8a53-09b39b455230	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-10 16:27:28.556786+00	
00000000-0000-0000-0000-000000000000	b4591bc8-0b49-416b-a2a3-14a0468b488d	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-13 12:11:38.054023+00	
00000000-0000-0000-0000-000000000000	40362315-943d-44aa-bc5b-0842fd14324b	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-13 12:11:38.071544+00	
00000000-0000-0000-0000-000000000000	f3a4f970-f5fb-46bd-b0c5-5fe72034b531	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-13 13:38:23.966065+00	
00000000-0000-0000-0000-000000000000	6b4eb49b-6528-4cc2-88a3-bd3f0fe4b8cc	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-13 13:38:23.986903+00	
00000000-0000-0000-0000-000000000000	d81e7e59-c9a7-4f5c-968c-e3a3f2cdb250	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-13 14:55:34.992525+00	
00000000-0000-0000-0000-000000000000	1481d235-7330-4eaf-8a9f-df6b54f7289a	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-13 14:55:35.015983+00	
00000000-0000-0000-0000-000000000000	c677545f-a847-4a3d-b453-1b8899a40337	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-13 16:08:29.771523+00	
00000000-0000-0000-0000-000000000000	1e21157c-94a1-42a2-928d-db1ac3722e02	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-13 16:08:29.787247+00	
00000000-0000-0000-0000-000000000000	27091aca-fa64-4ff4-8835-8532f252c111	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-14 12:24:53.650348+00	
00000000-0000-0000-0000-000000000000	90b5deb7-50b3-4788-9dde-f3c49382a384	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-14 12:24:53.671978+00	
00000000-0000-0000-0000-000000000000	d8cd2a0d-ec74-45f2-88f5-2d6064fb7e29	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-14 13:24:47.826678+00	
00000000-0000-0000-0000-000000000000	a90626e1-397b-43ee-867c-19c6144cdce7	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-14 13:24:47.839425+00	
00000000-0000-0000-0000-000000000000	66da917c-c524-4810-a6cb-7a89136be3fc	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-14 14:33:20.325224+00	
00000000-0000-0000-0000-000000000000	232f5c9a-4882-4768-a460-021f31aaea5c	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-14 14:33:20.334518+00	
00000000-0000-0000-0000-000000000000	417b83b6-897b-421f-a67e-f22fce682055	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-14 17:07:51.066973+00	
00000000-0000-0000-0000-000000000000	a3284891-f225-4ebd-b53f-5980c46c37be	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-14 17:07:51.08573+00	
00000000-0000-0000-0000-000000000000	dd9f5256-858c-41ef-a1c2-3a03ac7dd7eb	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-15 12:24:01.908557+00	
00000000-0000-0000-0000-000000000000	1eaf7d97-5b4c-495b-b20f-0569d45ea574	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-15 12:24:01.934938+00	
00000000-0000-0000-0000-000000000000	bf064668-8184-4908-b09a-da88d820793b	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-15 14:46:49.219061+00	
00000000-0000-0000-0000-000000000000	67ab44f6-11e2-40e4-b900-50c5045b861d	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-15 14:46:49.235413+00	
00000000-0000-0000-0000-000000000000	18a55add-8a17-4881-a34b-24c7107861c2	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-16 12:10:25.544284+00	
00000000-0000-0000-0000-000000000000	2e6f0e90-30c9-470a-94a8-61d0108d783e	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-16 12:10:25.566341+00	
00000000-0000-0000-0000-000000000000	5f7f1f77-7134-45b7-a347-605f0926d157	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-16 13:22:54.665209+00	
00000000-0000-0000-0000-000000000000	23c9c553-b59c-44b7-b961-94ac8323d125	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-16 13:22:54.680327+00	
00000000-0000-0000-0000-000000000000	3f80375f-db2b-4862-93d7-c69450768ad8	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-16 14:50:13.42571+00	
00000000-0000-0000-0000-000000000000	c494f37d-a627-4ec8-a6e0-73101a68da51	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-16 14:50:13.443584+00	
00000000-0000-0000-0000-000000000000	3bf58b84-bbeb-437b-a13c-c20dab02d0cf	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-16 16:46:24.127749+00	
00000000-0000-0000-0000-000000000000	4bac6000-634d-41c3-9b9e-b3039126b704	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-16 16:46:24.139632+00	
00000000-0000-0000-0000-000000000000	acc1337b-dd2f-487a-a594-aadf9c735600	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-17 12:11:02.279238+00	
00000000-0000-0000-0000-000000000000	e240c420-6628-4a1f-88f6-4d66772cf3a6	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-17 12:11:02.296974+00	
00000000-0000-0000-0000-000000000000	09626382-bc09-4b5a-bce5-d102bda61feb	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-17 14:53:42.148022+00	
00000000-0000-0000-0000-000000000000	55f3b680-f01f-4701-bcee-6ca47d661962	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-17 14:53:42.166628+00	
00000000-0000-0000-0000-000000000000	db22ede3-e32f-400c-9324-355183fa536e	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-17 17:13:52.393788+00	
00000000-0000-0000-0000-000000000000	f4f109af-4fdf-400f-b572-c720f98c7450	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-17 17:13:52.404211+00	
00000000-0000-0000-0000-000000000000	daf43dec-c624-4291-b7d9-f3529a587a84	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-18 16:54:15.898694+00	
00000000-0000-0000-0000-000000000000	92d4a4cc-da88-46a6-94e0-76164724730d	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-18 16:54:15.920031+00	
00000000-0000-0000-0000-000000000000	1739de76-8b92-4551-94a8-08db28767245	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-18 17:55:22.177125+00	
00000000-0000-0000-0000-000000000000	7468bb09-378e-430a-ad2a-2583319e1c7a	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-18 17:55:22.188624+00	
00000000-0000-0000-0000-000000000000	27f87cbb-0c8c-4e63-bd91-a6e42e4c09c9	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-18 19:07:42.781825+00	
00000000-0000-0000-0000-000000000000	7984760e-6853-4e4f-b722-8cb34c8546b2	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-18 19:07:42.787728+00	
00000000-0000-0000-0000-000000000000	d7c454f0-0cd7-4e14-99c4-4ae97f744892	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-19 16:52:59.388111+00	
00000000-0000-0000-0000-000000000000	2c8821ae-0c9a-4630-9df5-c3eab6eb954a	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-19 16:52:59.410344+00	
00000000-0000-0000-0000-000000000000	019888b6-bedb-47f4-81d8-7a52e679031f	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-19 17:36:00.40352+00	
00000000-0000-0000-0000-000000000000	6bf99ed7-8afb-499f-9a70-705bf6875daa	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-19 17:36:00.419709+00	
00000000-0000-0000-0000-000000000000	9e3f57e2-8410-4a32-9312-6e4647157b8e	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-19 18:48:25.015701+00	
00000000-0000-0000-0000-000000000000	071649ed-6103-4255-ab60-4ce872c7699b	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-19 18:48:25.035536+00	
00000000-0000-0000-0000-000000000000	6e0560c7-1b54-4b80-b0e7-67fbc5c33626	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-19 19:55:15.118189+00	
00000000-0000-0000-0000-000000000000	02aaccd3-5d91-40a3-b9cc-e8fc9a0fbc2f	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-19 19:55:15.133967+00	
00000000-0000-0000-0000-000000000000	e4dcb359-b372-49ff-8679-0241192b661c	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-21 12:09:14.484721+00	
00000000-0000-0000-0000-000000000000	3d27cd47-0bd8-44eb-bb04-c996eec33d67	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-21 12:09:14.503395+00	
00000000-0000-0000-0000-000000000000	9a76232d-bb6d-47c5-a42a-b5aee1a355bb	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-21 14:03:00.923049+00	
00000000-0000-0000-0000-000000000000	89e7d730-4018-4394-acfb-3725659227e7	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-21 14:03:00.932197+00	
00000000-0000-0000-0000-000000000000	41ace0e5-c5e5-4d68-8f66-d6d09363fbee	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-21 15:04:18.496245+00	
00000000-0000-0000-0000-000000000000	22fbdbaf-3be6-471a-a91d-a5c99d0152cc	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-21 15:04:18.513979+00	
00000000-0000-0000-0000-000000000000	316160d7-7bd4-402b-a2b0-5d3bb8e16311	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-04-21 16:26:14.368133+00	
00000000-0000-0000-0000-000000000000	1245018f-7ef3-4e84-9f13-cd3599f09273	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-04-21 16:26:14.388207+00	
00000000-0000-0000-0000-000000000000	e580d9e2-cb74-4763-a288-408ae7dcccf1	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-21 16:28:46.819295+00	
00000000-0000-0000-0000-000000000000	d30a0e3d-a621-4bcc-b1b8-6bd7f7163b08	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-21 16:28:46.822318+00	
00000000-0000-0000-0000-000000000000	a23258de-3d27-452a-b474-ff46463cec09	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-21 16:40:32.908189+00	
00000000-0000-0000-0000-000000000000	9fe71360-2aff-4462-87d9-9370ddfb7a20	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-21 16:40:32.916352+00	
00000000-0000-0000-0000-000000000000	658b80b7-c84d-4ddd-b10b-d00b405e78a2	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-21 17:55:54.716708+00	
00000000-0000-0000-0000-000000000000	4dcde563-e6c7-4798-ac85-dd2ae43944fb	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-21 17:55:54.740987+00	
00000000-0000-0000-0000-000000000000	cf7d782b-758a-4b9f-9f6e-890ecda9d1de	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-21 17:57:09.472395+00	
00000000-0000-0000-0000-000000000000	c00466c0-a22f-4b26-bb51-615f1b9d3e40	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-21 17:57:09.476135+00	
00000000-0000-0000-0000-000000000000	3f85f646-135a-4185-bf1f-f8052ac2c493	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-21 18:22:42.955102+00	
00000000-0000-0000-0000-000000000000	b0609f47-83fa-4c50-9a82-7f56756acc9d	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-21 18:22:42.96291+00	
00000000-0000-0000-0000-000000000000	e68b0d15-2058-444f-bc72-4541af22ef58	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-04-21 19:07:13.84705+00	
00000000-0000-0000-0000-000000000000	67967b67-b6b0-42f7-8b56-3718eae70aea	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-04-21 19:07:13.859495+00	
00000000-0000-0000-0000-000000000000	c626feab-e153-486c-a685-4c0ce74d8d61	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-21 19:22:38.042483+00	
00000000-0000-0000-0000-000000000000	18fcdda8-59a3-4aa3-93ce-24e414f93aa2	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-21 19:22:38.048793+00	
00000000-0000-0000-0000-000000000000	1b6e8903-a48b-44b8-8250-3f73083f552f	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-22 12:04:09.206596+00	
00000000-0000-0000-0000-000000000000	2fcb9076-32ef-4f3a-b6ce-8df3a5022312	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-22 12:04:09.231921+00	
00000000-0000-0000-0000-000000000000	d8a40ff4-3a48-495a-8d15-b12c3c36e8ca	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-22 14:07:34.015203+00	
00000000-0000-0000-0000-000000000000	9910b797-fd41-475f-b18f-36901c9393ce	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-22 14:07:34.031268+00	
00000000-0000-0000-0000-000000000000	dda5b95f-f48e-4c0d-83c6-0f0433961334	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-22 17:08:10.708807+00	
00000000-0000-0000-0000-000000000000	977caa60-9f22-4823-8936-0ebd2d9ddb93	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-22 17:08:10.72585+00	
00000000-0000-0000-0000-000000000000	bad67ea5-6217-4b11-913e-43a07b183201	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-22 21:44:20.417533+00	
00000000-0000-0000-0000-000000000000	ff42231a-859d-400a-8451-b9c1a71bd0bc	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-22 21:50:52.549557+00	
00000000-0000-0000-0000-000000000000	b7769d01-42f0-4720-89fc-a8cdd3c74771	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-22 21:50:59.82348+00	
00000000-0000-0000-0000-000000000000	4b5163aa-cdd6-4d8e-a5e1-bf925497d025	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-22 21:54:41.153914+00	
00000000-0000-0000-0000-000000000000	31b9cffc-0e86-4394-8173-a29d00642dd3	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-22 21:54:53.150489+00	
00000000-0000-0000-0000-000000000000	239f8e79-e2d5-422e-8ea8-6c67c8a55423	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-22 21:55:07.257492+00	
00000000-0000-0000-0000-000000000000	e7db089c-34d8-429b-ac4b-b6dec480673d	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-22 21:55:24.321938+00	
00000000-0000-0000-0000-000000000000	e422b6af-5049-4456-b43c-f7d9da2c428f	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-22 21:59:05.042783+00	
00000000-0000-0000-0000-000000000000	901379c6-2089-4259-ad95-808b78f043d8	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-22 22:08:11.074963+00	
00000000-0000-0000-0000-000000000000	4f3766b9-f8ef-4f0d-a61e-784849072d74	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-22 22:21:05.168752+00	
00000000-0000-0000-0000-000000000000	9d139694-49a1-4e34-b6d6-acdeafce467d	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-23 12:03:10.707402+00	
00000000-0000-0000-0000-000000000000	54279761-5d2c-4dff-bfd5-94e9051bd6cd	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-23 12:03:10.730884+00	
00000000-0000-0000-0000-000000000000	76cebd98-91e9-4944-8042-ed4a586677a7	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-23 14:32:02.834546+00	
00000000-0000-0000-0000-000000000000	eab5c4a5-ed65-406a-8460-bdd9fc194b01	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-23 14:32:02.851631+00	
00000000-0000-0000-0000-000000000000	242f9db4-9413-48f5-8614-281ed66c149e	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-23 16:14:27.211544+00	
00000000-0000-0000-0000-000000000000	acc0e1fd-be17-4e67-805b-fa6866a6ada5	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-23 16:14:27.229836+00	
00000000-0000-0000-0000-000000000000	e7ba9aa9-cce6-4ac8-9f98-02f2e0133979	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-04-23 16:42:25.915231+00	
00000000-0000-0000-0000-000000000000	ef833287-11d5-462a-ad85-e8ce1b582e16	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-04-23 16:42:25.927161+00	
00000000-0000-0000-0000-000000000000	ea2a66c9-b2e6-4460-81c0-a84883773e55	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-23 16:43:38.053661+00	
00000000-0000-0000-0000-000000000000	be6bb311-851e-42cc-bfe6-641347de26b1	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-23 20:09:45.928562+00	
00000000-0000-0000-0000-000000000000	9a23c177-4652-4260-94d8-9186d0453579	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-23 20:09:45.942838+00	
00000000-0000-0000-0000-000000000000	248374c1-f869-40fb-9e1f-92e29967623f	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-23 20:18:29.69501+00	
00000000-0000-0000-0000-000000000000	ca858325-8a37-40ac-9c92-e7d91bb9d6b3	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-23 20:24:05.521489+00	
00000000-0000-0000-0000-000000000000	81f38f27-d305-4fb9-81a6-88e72c22d2ce	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-23 20:24:30.064765+00	
00000000-0000-0000-0000-000000000000	e797e418-cda9-497f-b204-1b0c1dc6bf70	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-23 20:25:22.694167+00	
00000000-0000-0000-0000-000000000000	16022828-3025-492b-92cd-ad928981be0f	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-24 12:01:20.734402+00	
00000000-0000-0000-0000-000000000000	568f711b-3544-4cba-bfd4-f7c625133ef9	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-24 12:01:20.754053+00	
00000000-0000-0000-0000-000000000000	55a833d8-b508-4162-b3f5-cab876f356b3	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-24 14:49:45.89432+00	
00000000-0000-0000-0000-000000000000	1b7021e1-e2e0-4abb-9bf4-4057a1ef3a1b	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-24 14:49:45.910932+00	
00000000-0000-0000-0000-000000000000	507f1508-0c44-4fa2-8c4d-c3b9f7d6fc79	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-24 16:48:44.707884+00	
00000000-0000-0000-0000-000000000000	46d8c82d-be5d-48c7-a157-3d8c2037a757	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-24 16:48:44.729994+00	
00000000-0000-0000-0000-000000000000	cdca62d1-6239-4051-971b-7ca447cd74f2	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-24 18:59:17.36007+00	
00000000-0000-0000-0000-000000000000	e29a6158-b4c5-42fa-917e-7589dcb1950b	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-24 18:59:17.370335+00	
00000000-0000-0000-0000-000000000000	dc48d1e8-8cd3-4fbf-a2a7-709b8b7aa7ae	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-24 18:59:41.986999+00	
00000000-0000-0000-0000-000000000000	c1c32907-7745-49b0-a072-4213baf189d5	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-24 18:59:41.988266+00	
00000000-0000-0000-0000-000000000000	bde0a7c6-b007-4d9c-80ed-f09f393e6a62	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-24 19:41:16.356278+00	
00000000-0000-0000-0000-000000000000	90766220-0961-4fee-94e7-428160912739	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-24 19:57:49.395602+00	
00000000-0000-0000-0000-000000000000	690fa373-c93b-4cf7-972e-1b05ae16a072	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-24 19:57:49.401117+00	
00000000-0000-0000-0000-000000000000	0958fc84-6ecd-4398-b4e9-995641f1afd9	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-24 20:09:05.543335+00	
00000000-0000-0000-0000-000000000000	83119697-153a-43e5-acd3-6e3ee99cbd49	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-24 20:15:10.407198+00	
00000000-0000-0000-0000-000000000000	2f8f4dcb-ce46-4c5b-ac18-be3c6c0ec0b9	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-24 20:15:10.415377+00	
00000000-0000-0000-0000-000000000000	16e82cb3-aebe-4641-b18d-203ded48985a	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-24 20:18:41.130844+00	
00000000-0000-0000-0000-000000000000	f76c13e7-24d4-45d5-89b1-d0dff4f4a9da	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-24 20:18:41.131796+00	
00000000-0000-0000-0000-000000000000	e53fa82e-ebc9-43c4-9bfa-9f7caa422b5e	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-24 20:19:10.104193+00	
00000000-0000-0000-0000-000000000000	4d7fce24-762c-40d1-a6f8-7b6ca142d2ef	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-24 20:29:47.49183+00	
00000000-0000-0000-0000-000000000000	de1d19a5-ecd9-4ed4-9375-65b194938980	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-04-24 23:08:39.998553+00	
00000000-0000-0000-0000-000000000000	127e671a-f63e-4fb4-ac88-d384520b022c	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-04-24 23:08:40.023535+00	
00000000-0000-0000-0000-000000000000	8d9f8e13-927c-4a9a-aaa9-50eb4b22c21b	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-27 12:14:08.094975+00	
00000000-0000-0000-0000-000000000000	5cd746dc-aea0-4c8f-bac9-7963a40b5d6b	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-27 12:14:08.118993+00	
00000000-0000-0000-0000-000000000000	0a21c7f8-9824-4515-a3f1-f27cd30d6310	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-27 14:43:27.416285+00	
00000000-0000-0000-0000-000000000000	0be35d88-6314-4e9f-bbe8-9e7308aa69a7	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-27 14:43:27.433938+00	
00000000-0000-0000-0000-000000000000	a75786d5-0595-449f-92d7-6aa66b712add	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-27 16:19:17.270909+00	
00000000-0000-0000-0000-000000000000	2f6e0592-79ab-4cb2-9b17-edab713a1f26	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-27 16:19:17.279734+00	
00000000-0000-0000-0000-000000000000	17ea36bb-2e1e-46ca-8112-60741073a7f0	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-04-27 17:17:29.073093+00	
00000000-0000-0000-0000-000000000000	2df04dcb-2603-4099-8388-36347de0d14f	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-04-27 17:17:29.082206+00	
00000000-0000-0000-0000-000000000000	434b3b49-ff2e-4804-930c-31c437ea6c9a	{"action":"logout","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account"}	2026-04-27 17:17:33.02344+00	
00000000-0000-0000-0000-000000000000	27e9010d-fd4e-4542-9ee1-f65da24a1811	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"amandacorte053@gmail.com","user_id":"16ddd940-9f73-4313-ba08-9ee96735181c","user_phone":""}}	2026-04-27 17:21:11.98543+00	
00000000-0000-0000-0000-000000000000	3e908722-2445-474e-b380-474a660a8d0b	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-27 17:21:26.647526+00	
00000000-0000-0000-0000-000000000000	ae45ea69-62fc-499d-add4-477a0720f173	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-27 17:24:05.09128+00	
00000000-0000-0000-0000-000000000000	ffe1b928-afdc-44bb-883d-0d9f341c20e8	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-27 17:59:06.099883+00	
00000000-0000-0000-0000-000000000000	64629f3c-2e7d-40f5-8cf9-f7fe1b607119	{"action":"token_refreshed","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-28 19:36:16.69655+00	
00000000-0000-0000-0000-000000000000	f6f42ebe-309e-422b-878c-eb083a463c6e	{"action":"token_revoked","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-28 19:36:16.718748+00	
00000000-0000-0000-0000-000000000000	5925bf98-7c4d-4160-878b-9093a9a458a2	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-28 19:36:24.369686+00	
00000000-0000-0000-0000-000000000000	54afc0b7-4bc7-4e30-9019-b6e8587a8cb5	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-28 20:55:39.031948+00	
00000000-0000-0000-0000-000000000000	3453b74f-24a5-470d-837d-7ccd8b508064	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-28 20:55:39.041608+00	
00000000-0000-0000-0000-000000000000	a82bf941-5dcf-49a3-b3a3-a18ff4c9f53b	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-29 12:32:06.654594+00	
00000000-0000-0000-0000-000000000000	6f46d79a-ac12-44b1-94cf-b120c1927c4f	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-29 12:32:06.678589+00	
00000000-0000-0000-0000-000000000000	777f6283-62b7-44d0-ac6d-5b1d463f0132	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-29 13:32:38.227051+00	
00000000-0000-0000-0000-000000000000	b6be442d-e2d5-40e7-ab32-11869ee1dd83	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-29 13:32:38.237128+00	
00000000-0000-0000-0000-000000000000	4e07d99a-79b3-4c0c-85c9-c1e74c044327	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-29 14:58:56.418206+00	
00000000-0000-0000-0000-000000000000	7bb31b3e-5847-4550-8de8-9f3f4091980a	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-29 14:58:56.426877+00	
00000000-0000-0000-0000-000000000000	3f41bb4a-8b62-4e79-9d64-331f10ff4b5b	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-29 15:00:21.294707+00	
00000000-0000-0000-0000-000000000000	a7712759-3c58-49ce-b20d-e01920c5173b	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-29 15:00:21.296994+00	
00000000-0000-0000-0000-000000000000	5a4c2fbc-747c-405d-b8e4-cc640d18913d	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-29 15:11:01.708536+00	
00000000-0000-0000-0000-000000000000	c37c034b-fd0f-4388-a961-c6a7ce0af52a	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 15:21:38.39308+00	
00000000-0000-0000-0000-000000000000	fee1824c-c9a4-44bc-951d-178e609305e3	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 15:25:28.276497+00	
00000000-0000-0000-0000-000000000000	65bb61e9-5866-457c-ae3a-2627eb871bee	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 15:52:47.829781+00	
00000000-0000-0000-0000-000000000000	41ac4ab8-0cfe-4c67-8f46-c098d5acf279	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-29 21:14:09.047022+00	
00000000-0000-0000-0000-000000000000	5ac9a858-086c-4da1-8f13-2c6129fdeeb2	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"mh.escritoriocarmella@gmail.com","user_id":"1d621888-613a-4a15-b796-3c4120f51af2","user_phone":""}}	2026-04-29 15:56:53.656936+00	
00000000-0000-0000-0000-000000000000	1af10f45-449d-49c6-8fb7-be805888ba3c	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 15:58:53.656652+00	
00000000-0000-0000-0000-000000000000	84308867-6015-44c6-9cae-882980b825a9	{"action":"logout","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-29 16:07:00.336124+00	
00000000-0000-0000-0000-000000000000	783f2dda-81f2-4217-915e-bca31af9a17e	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 16:09:59.916969+00	
00000000-0000-0000-0000-000000000000	757168ec-a9e6-405a-aaa7-206b3a62279f	{"action":"logout","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-29 16:17:22.274484+00	
00000000-0000-0000-0000-000000000000	2d1c1a1b-92e9-431a-baca-ff847ee32105	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 16:18:52.363425+00	
00000000-0000-0000-0000-000000000000	2988567d-6775-4de9-9ff9-fc30e20fe54b	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-29 16:56:56.148216+00	
00000000-0000-0000-0000-000000000000	7e704da3-d15e-45fb-af7e-553857c6772a	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-29 16:56:56.165906+00	
00000000-0000-0000-0000-000000000000	3ec462d6-599e-4c04-9565-7e313604afba	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 16:59:07.394218+00	
00000000-0000-0000-0000-000000000000	aa3e8ccf-4241-4788-942a-40d544cb102c	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-29 16:59:08.741324+00	
00000000-0000-0000-0000-000000000000	b36774a3-7ff8-4fb5-b27f-79879097eb6e	{"action":"logout","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-29 17:07:09.302908+00	
00000000-0000-0000-0000-000000000000	8be594f2-cf0b-4a8f-be4a-1bf7ee5911ab	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 17:07:13.531685+00	
00000000-0000-0000-0000-000000000000	f10920b5-8181-4d7c-8b64-b427d7ab98fb	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-29 17:33:50.990035+00	
00000000-0000-0000-0000-000000000000	30b7fd5c-eb92-46f9-adc1-f179cef88029	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-29 17:33:51.002857+00	
00000000-0000-0000-0000-000000000000	3b4c557f-dd60-4625-a294-7e4198455314	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 18:51:14.211519+00	
00000000-0000-0000-0000-000000000000	153f9dda-2fa1-402c-99cf-ba69b0a50cd3	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 18:55:37.785997+00	
00000000-0000-0000-0000-000000000000	7bb0a75d-4509-4927-91ff-6f5e56aacb28	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-29 19:05:03.273551+00	
00000000-0000-0000-0000-000000000000	170eb841-eabc-4cb1-8147-f19c5fb27698	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-29 19:05:03.280993+00	
00000000-0000-0000-0000-000000000000	cdf15eec-76e3-4983-8ebe-e18c7c823ee0	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 19:28:57.761698+00	
00000000-0000-0000-0000-000000000000	81780717-857b-4643-8514-e1b76ba94f6b	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 19:38:27.877075+00	
00000000-0000-0000-0000-000000000000	a13c4d76-729e-41f8-a008-d46f60a2aad5	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-29 19:45:52.869647+00	
00000000-0000-0000-0000-000000000000	3e701fbc-d787-46d6-897f-d08ffff37b32	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 19:50:15.005727+00	
00000000-0000-0000-0000-000000000000	d63e5861-c504-4d79-8791-01ec17680b91	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 20:10:39.505598+00	
00000000-0000-0000-0000-000000000000	76ab3c24-189b-4cef-bb46-0b2768979dfc	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-29 20:36:28.053484+00	
00000000-0000-0000-0000-000000000000	b07c0bb0-a11f-4da2-af57-f58815c48faa	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-29 20:36:28.06799+00	
00000000-0000-0000-0000-000000000000	87a732ca-2bdc-462e-a48e-71d08cd2a303	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 20:38:24.863737+00	
00000000-0000-0000-0000-000000000000	2b5ca78e-0342-41c2-bf18-57fc32dafbb4	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 20:41:08.82017+00	
00000000-0000-0000-0000-000000000000	3c1a4323-d0ca-4f4d-ac5b-bb040eea2c4c	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 20:44:23.005101+00	
00000000-0000-0000-0000-000000000000	d36d8a53-94d8-4a4f-ba51-1bd7b4cf7cba	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 20:45:36.386864+00	
00000000-0000-0000-0000-000000000000	a0df13df-7b87-462e-a9bd-b19acbab0e81	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-29 20:46:55.587062+00	
00000000-0000-0000-0000-000000000000	3b9197db-5cec-4050-bae5-713ed43a004b	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-29 21:14:09.034863+00	
00000000-0000-0000-0000-000000000000	d87d7a09-ce17-4c89-a7f3-ce038a5bd282	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 22:02:21.2633+00	
00000000-0000-0000-0000-000000000000	d67a05f5-e5d4-4f24-aec8-49a0d6f6ba47	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-29 22:09:19.688226+00	
00000000-0000-0000-0000-000000000000	9282dffc-d134-4832-8803-b4680b812fde	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 12:27:16.055085+00	
00000000-0000-0000-0000-000000000000	e66182ae-cf08-4930-bc51-b9db6106b594	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 12:27:16.077615+00	
00000000-0000-0000-0000-000000000000	595faabc-be4d-43ac-9ec6-761d5a4d057e	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 13:31:19.307+00	
00000000-0000-0000-0000-000000000000	8ecbe5b7-dce7-43d4-a2de-a835676cfdc8	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 13:31:19.329954+00	
00000000-0000-0000-0000-000000000000	99b6fa40-8abc-4ad6-8070-72dd91d2f0b9	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-04-30 14:04:50.191802+00	
00000000-0000-0000-0000-000000000000	05b814b5-8ec6-4a00-b533-62de5bba7394	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-04-30 14:04:50.206307+00	
00000000-0000-0000-0000-000000000000	27a95056-6c9c-41ce-af97-39145a3e94f3	{"action":"token_refreshed","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 14:16:01.455593+00	
00000000-0000-0000-0000-000000000000	019f8dbb-8ba9-422e-b3b3-10f837369882	{"action":"token_revoked","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 14:16:01.465084+00	
00000000-0000-0000-0000-000000000000	5901aaaf-699d-486b-932a-908be0a22efd	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 14:16:13.635889+00	
00000000-0000-0000-0000-000000000000	2379cc4f-d0e1-49fd-a7fb-280a60f2c7fb	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 14:16:13.638899+00	
00000000-0000-0000-0000-000000000000	93cf1e9c-2ad2-49a6-882f-1614b0367aa9	{"action":"logout","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-30 14:21:18.180206+00	
00000000-0000-0000-0000-000000000000	3db7a9b0-4131-405b-a969-646c0fc90400	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-30 14:21:27.588603+00	
00000000-0000-0000-0000-000000000000	204e69ed-456b-497e-b799-8f36d4f30be2	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 14:29:29.171645+00	
00000000-0000-0000-0000-000000000000	c1dfef54-e1e3-4e2f-83a8-e294b5e302dd	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 14:29:29.174687+00	
00000000-0000-0000-0000-000000000000	57f0f650-2887-4799-928f-47e86445d116	{"action":"logout","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-30 15:00:33.999627+00	
00000000-0000-0000-0000-000000000000	179eceae-e416-4f0e-87d6-aba25f0e454e	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-30 15:11:38.277805+00	
00000000-0000-0000-0000-000000000000	225738dc-2e6f-480a-bc2c-546ec889a8a6	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 15:14:17.699557+00	
00000000-0000-0000-0000-000000000000	0157f24c-e36e-46a5-9a06-e2399776ec0d	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 15:14:17.712325+00	
00000000-0000-0000-0000-000000000000	19f9ed4a-78b5-4473-af72-c11baf0c5a14	{"action":"token_refreshed","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 15:19:29.67311+00	
00000000-0000-0000-0000-000000000000	cc29939c-903e-4dbb-b424-a8f6b0ac30a5	{"action":"token_revoked","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 15:19:29.674871+00	
00000000-0000-0000-0000-000000000000	39e4c363-fb7a-4c48-b3a6-8ca835af4df3	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-04-30 15:36:10.415517+00	
00000000-0000-0000-0000-000000000000	4298074c-0fcd-47f0-a93c-8c765669fb76	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-04-30 15:36:10.423488+00	
00000000-0000-0000-0000-000000000000	f4c82521-a9c6-499b-b15d-9b658fb591c0	{"action":"logout","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account"}	2026-04-30 15:36:10.573932+00	
00000000-0000-0000-0000-000000000000	a387922f-bd7a-41b0-9fb3-6cc91c26a1cb	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 16:23:36.209074+00	
00000000-0000-0000-0000-000000000000	aec75f58-4cfa-48cd-bcee-e92913ee3e9c	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 16:23:36.221804+00	
00000000-0000-0000-0000-000000000000	b99c081c-c9ee-4199-a007-8109653bb892	{"action":"token_refreshed","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 17:31:23.413619+00	
00000000-0000-0000-0000-000000000000	92762f0e-8e25-4041-b0a8-e48ae372c404	{"action":"token_revoked","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 17:31:23.428239+00	
00000000-0000-0000-0000-000000000000	0419dbb2-088a-4a6d-aef5-7559132e15af	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 18:54:10.835402+00	
00000000-0000-0000-0000-000000000000	ce206ab6-8743-4ccf-8967-f84e53055631	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 18:54:10.858426+00	
00000000-0000-0000-0000-000000000000	feed4b34-83fa-4a4c-8f15-d9380b84ca0f	{"action":"token_refreshed","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 18:54:22.186586+00	
00000000-0000-0000-0000-000000000000	a41ef09f-e1f3-4ec6-a961-5874debac5ca	{"action":"token_revoked","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 18:54:22.190392+00	
00000000-0000-0000-0000-000000000000	97f350f3-a4b2-4993-a244-0c295350a9de	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-30 18:59:45.883957+00	
00000000-0000-0000-0000-000000000000	441e4f5c-818c-4f71-8c4c-e29c1e2371ef	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 19:28:16.546276+00	
00000000-0000-0000-0000-000000000000	15968efc-4866-4bd9-9b49-ff6973d073e3	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-30 19:34:48.630558+00	
00000000-0000-0000-0000-000000000000	0b7b7c88-5350-49c7-a847-3d5ebb647928	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-30 19:43:36.017971+00	
00000000-0000-0000-0000-000000000000	ecc8a547-52a2-4bdf-a891-0d713c18f778	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-30 19:44:19.02892+00	
00000000-0000-0000-0000-000000000000	859d0af9-67d2-4108-9bce-0d9e663c1baf	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-04-30 19:46:45.452085+00	
00000000-0000-0000-0000-000000000000	0e8cc240-c6f8-4ace-92a7-be81e44b8959	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-30 19:51:36.998592+00	
00000000-0000-0000-0000-000000000000	5086aa99-95ad-4639-803a-ad17df9b0978	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-30 20:22:25.993941+00	
00000000-0000-0000-0000-000000000000	08bd611d-64dc-4aff-95fa-5ad749a380a4	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 20:27:10.483621+00	
00000000-0000-0000-0000-000000000000	7cf8587c-5caf-46c4-8e7a-bb4d22ca8158	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 20:27:10.487342+00	
00000000-0000-0000-0000-000000000000	8864f3dc-2147-4add-ba74-6fd2a3a82e00	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-04-30 20:38:46.630829+00	
00000000-0000-0000-0000-000000000000	d2609db2-c0a5-4e4f-9da2-893a1d01d810	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 22:57:23.513107+00	
00000000-0000-0000-0000-000000000000	18fa400c-fec2-445f-8583-0fdc8a6ca441	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-04-30 22:57:23.532425+00	
00000000-0000-0000-0000-000000000000	16c25789-07a7-4ebf-96bb-3631218e6649	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-01 00:44:15.022823+00	
00000000-0000-0000-0000-000000000000	7553f544-42d8-413b-9e48-e74be231a698	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-01 13:03:51.394702+00	
00000000-0000-0000-0000-000000000000	7121bdb7-4c4d-432e-bbe6-18251660c663	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-01 14:19:01.252107+00	
00000000-0000-0000-0000-000000000000	38b32f53-cbf3-4f53-9fec-080b961d9af3	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-01 14:19:01.271131+00	
00000000-0000-0000-0000-000000000000	6d38debc-b080-4134-95fe-f10d3a12c60c	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-01 16:28:14.543585+00	
00000000-0000-0000-0000-000000000000	0249de50-b333-48b0-9272-b96eed72757e	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-01 16:28:14.554692+00	
00000000-0000-0000-0000-000000000000	cd62c879-1059-4d99-935d-247597fd67aa	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-01 16:29:47.574596+00	
00000000-0000-0000-0000-000000000000	0856be49-84cf-4758-a12e-2fa7a2f54cff	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-01 16:33:12.077949+00	
00000000-0000-0000-0000-000000000000	b45b9560-6670-4100-90a2-94299c9656e2	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-01 16:35:57.276415+00	
00000000-0000-0000-0000-000000000000	77c2d269-c53f-4cda-a82b-de5b3650c027	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-01 16:39:39.937244+00	
00000000-0000-0000-0000-000000000000	f1c3ead3-1d71-4e1a-b8ac-ae93d713db1f	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-01 16:40:53.821231+00	
00000000-0000-0000-0000-000000000000	07dd855c-5209-4e9b-8acf-f543d9a70cbc	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-01 16:55:08.215817+00	
00000000-0000-0000-0000-000000000000	64a5dc19-d212-4b32-843a-8eb9a6945ab5	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-01 17:19:23.17051+00	
00000000-0000-0000-0000-000000000000	f0fc321d-fed5-4e3a-a248-17e39c93a7b0	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-01 18:09:50.513861+00	
00000000-0000-0000-0000-000000000000	f0a37ffa-534b-468a-b2bc-113fcf7838c3	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-01 18:11:09.71307+00	
00000000-0000-0000-0000-000000000000	e2674088-5257-4103-ba10-44b9823fdcbd	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-01 18:11:09.716688+00	
00000000-0000-0000-0000-000000000000	9e290fef-4e1c-47be-87da-4b03f4835571	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-01 18:20:30.122531+00	
00000000-0000-0000-0000-000000000000	d7d42359-5552-447e-82f8-07056e481ba7	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-01 19:40:06.379442+00	
00000000-0000-0000-0000-000000000000	bcfe7644-56ac-45dd-99dc-e049b97d6356	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-01 19:52:50.408777+00	
00000000-0000-0000-0000-000000000000	1920808e-a648-418b-bd6f-347b40af53c2	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-01 19:55:12.866826+00	
00000000-0000-0000-0000-000000000000	e211f918-6482-4acf-bcde-6e90a5ec57fe	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-01 19:58:01.861337+00	
00000000-0000-0000-0000-000000000000	0d70bca5-5f73-4d59-af93-c8eb03663384	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-01 20:10:00.790976+00	
00000000-0000-0000-0000-000000000000	8597b40c-8583-4133-a3ed-97ab15c7d001	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-01 20:22:50.808617+00	
00000000-0000-0000-0000-000000000000	f76df4aa-db9f-4038-ab3b-11b2a602f263	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-01 20:28:10.449914+00	
00000000-0000-0000-0000-000000000000	10b4bf5c-7ee2-4871-b6ff-5caa3692fbe8	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-01 20:41:16.326113+00	
00000000-0000-0000-0000-000000000000	215180fd-2b9c-4285-be20-d6f98d560d9c	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-01 20:54:26.011091+00	
00000000-0000-0000-0000-000000000000	64f07b32-77e9-4a0e-b9f2-188e02112041	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-01 21:24:12.74507+00	
00000000-0000-0000-0000-000000000000	12bfe12a-d363-4c39-ac45-722476d99bc7	{"action":"token_refreshed","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-01 21:59:17.881328+00	
00000000-0000-0000-0000-000000000000	94de03a1-3ec5-422f-9e7e-f234c3e78b68	{"action":"token_revoked","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-01 21:59:17.891599+00	
00000000-0000-0000-0000-000000000000	bdf6463e-3d10-442c-bbcd-44de615ffc59	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-01 22:07:21.779123+00	
00000000-0000-0000-0000-000000000000	d6e76900-f448-4da6-8ead-9deb5f242f29	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-02 13:28:02.828444+00	
00000000-0000-0000-0000-000000000000	cfa91bf1-d300-43a5-a5fa-dac15b8785b4	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-02 14:58:23.452583+00	
00000000-0000-0000-0000-000000000000	cf7a7963-c776-489f-9c87-564cf7dad983	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-02 17:32:26.879018+00	
00000000-0000-0000-0000-000000000000	33e8b01f-2476-46ec-bc55-84bb6c13847c	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-02 17:32:26.893394+00	
00000000-0000-0000-0000-000000000000	9dd10cc4-088a-4e5d-a368-9fc4ece30cc5	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-02 21:27:08.980229+00	
00000000-0000-0000-0000-000000000000	0a0535f2-ad17-4d59-89c7-252aef803e02	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-03 12:28:20.783625+00	
00000000-0000-0000-0000-000000000000	f63222e3-76d4-4aa5-a248-1ee8759b3024	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-03 19:53:34.543529+00	
00000000-0000-0000-0000-000000000000	1928eea8-2023-40b6-9b7a-f3858f59e57c	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-03 20:30:25.870599+00	
00000000-0000-0000-0000-000000000000	097c870a-a52e-4cfd-893a-b9267a136695	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-03 20:32:37.718296+00	
00000000-0000-0000-0000-000000000000	852e21fb-64c0-4e1a-bf3b-26a10f2bc8ad	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-03 20:43:57.291491+00	
00000000-0000-0000-0000-000000000000	68d54e35-15b5-4c90-936d-ede11a60b0e1	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-03 21:41:16.854544+00	
00000000-0000-0000-0000-000000000000	5f2bce17-268a-41a9-b819-131ab23adbb4	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-04 12:12:14.391224+00	
00000000-0000-0000-0000-000000000000	7b74d074-f8d8-4a54-9680-311639f78fd7	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-04 12:12:14.416579+00	
00000000-0000-0000-0000-000000000000	6b57014f-4695-4ecb-993b-c9b1c3f104b7	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-04 13:12:46.567173+00	
00000000-0000-0000-0000-000000000000	d9f8d194-663a-4cda-b749-b50e05d4405e	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-04 13:12:46.589229+00	
00000000-0000-0000-0000-000000000000	5e7ed6e3-61e9-474b-b56c-380fa42cda3f	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-04 14:31:51.622491+00	
00000000-0000-0000-0000-000000000000	19c103fd-7169-48e8-8cb7-78bba62bec12	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-04 14:31:51.645184+00	
00000000-0000-0000-0000-000000000000	700d9edc-b458-468c-b8a1-0e37a9870825	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-04 17:02:09.535778+00	
00000000-0000-0000-0000-000000000000	0559e693-6fd9-4de6-98eb-a191ae6ea4a7	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-04 21:59:05.137312+00	
00000000-0000-0000-0000-000000000000	5564a889-4c30-4537-a920-9c3267a25aba	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-04 21:59:05.156188+00	
00000000-0000-0000-0000-000000000000	2f4378ce-f515-4c42-b53a-4bc6d0d36255	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-04 23:34:49.318647+00	
00000000-0000-0000-0000-000000000000	751780e1-0b7a-4c32-b619-a3736aca1a2e	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-04 23:34:49.335218+00	
00000000-0000-0000-0000-000000000000	e5ed593d-55a7-45a4-960d-72743127dde5	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-05 12:11:55.805422+00	
00000000-0000-0000-0000-000000000000	3bb648be-ec5d-4096-97be-35fcfafe7550	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-05 12:11:55.819625+00	
00000000-0000-0000-0000-000000000000	0b782981-b84c-4ee3-a575-28fe8324bd7c	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-05 12:13:14.944474+00	
00000000-0000-0000-0000-000000000000	1dcf9c7e-8586-41e8-b8d0-2e8668fc812c	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-05 13:21:32.226493+00	
00000000-0000-0000-0000-000000000000	c5f4b7eb-baa0-4d9f-b182-59b2b03e0bdb	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-05 13:21:32.249485+00	
00000000-0000-0000-0000-000000000000	f591c344-ff93-48a7-8dd0-bf88564a3223	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-05 14:35:53.229388+00	
00000000-0000-0000-0000-000000000000	510d7435-eb33-4d3b-8958-d3b78481486f	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-05 14:35:53.239317+00	
00000000-0000-0000-0000-000000000000	9d7c29d7-2924-4ee5-9491-7431e57e999f	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-05 14:49:35.83262+00	
00000000-0000-0000-0000-000000000000	4c87d6b2-54c5-44c8-b127-8d8faf423755	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-05 15:56:17.896668+00	
00000000-0000-0000-0000-000000000000	2f504f80-bf20-4c2c-8cc4-2169c9794684	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-05 16:18:35.622911+00	
00000000-0000-0000-0000-000000000000	5860d007-76c7-4615-87d3-5acffacb8ba4	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-05 18:29:22.414813+00	
00000000-0000-0000-0000-000000000000	e9802b27-1504-4c22-b853-7fce19395347	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-05 21:53:25.664763+00	
00000000-0000-0000-0000-000000000000	2c090102-e169-4d24-9ec9-e4f8d30a2ade	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-05 21:53:25.680553+00	
00000000-0000-0000-0000-000000000000	4f344b46-1b9b-4e08-8114-d267a5aca1d8	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-06 12:03:12.102281+00	
00000000-0000-0000-0000-000000000000	eb624f22-d40d-41c2-89fc-355fc9529ff4	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-06 12:03:12.12465+00	
00000000-0000-0000-0000-000000000000	a7f567ab-e1cd-4dc7-a417-6f553b8e9069	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-06 12:04:41.521259+00	
00000000-0000-0000-0000-000000000000	a60626fe-4b15-4abc-8451-5f7995b082a2	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-06 14:11:45.284645+00	
00000000-0000-0000-0000-000000000000	1fe073d4-d071-4cb1-8e14-e7d0b66e4b36	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-06 14:22:24.696143+00	
00000000-0000-0000-0000-000000000000	231ffbb3-30a5-468f-95d8-de04e1acffa7	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-06 14:22:24.702748+00	
00000000-0000-0000-0000-000000000000	f749f07b-39b5-4b2d-8a5c-6d49e695524f	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-06 14:50:32.033635+00	
00000000-0000-0000-0000-000000000000	62044126-cc9c-406f-8e3f-a943b67b3dd9	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-06 14:54:57.624313+00	
00000000-0000-0000-0000-000000000000	80a409ee-9750-42c5-8943-1aac2c157021	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-06 15:20:50.100223+00	
00000000-0000-0000-0000-000000000000	ef44fccf-9408-4ad0-9e08-c7c7b3ac58f4	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-06 15:20:50.11647+00	
00000000-0000-0000-0000-000000000000	a964cf2a-f81b-4db4-b3dc-830191706263	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-06 20:14:45.694885+00	
00000000-0000-0000-0000-000000000000	95305e37-98d4-44bc-aafd-61ffc54066bc	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-07 12:14:59.34573+00	
00000000-0000-0000-0000-000000000000	f457704c-e8e4-47cb-9bca-ee140ea2701c	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-07 12:14:59.364153+00	
00000000-0000-0000-0000-000000000000	b279be28-745e-48c4-a34a-11074709f025	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-07 13:26:19.964713+00	
00000000-0000-0000-0000-000000000000	1c4ee77d-b521-4a14-ada9-3ee5f41f5744	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-07 13:26:19.986489+00	
00000000-0000-0000-0000-000000000000	fec63bad-3d4f-49d9-adde-244e6177a0e8	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-07 14:45:17.3585+00	
00000000-0000-0000-0000-000000000000	cff2dc8a-ef72-495d-a77b-4662e87a6876	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-07 14:45:17.384501+00	
00000000-0000-0000-0000-000000000000	6e96dbdb-30f5-407c-b706-723fcd55a433	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-07 15:43:29.780969+00	
00000000-0000-0000-0000-000000000000	0124a6d4-1172-4658-9db1-465661669c6e	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-07 15:43:29.801369+00	
00000000-0000-0000-0000-000000000000	d23cc7f1-0e65-47b9-b273-d1025e99c667	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-07 16:30:21.073698+00	
00000000-0000-0000-0000-000000000000	a19c6af4-44ce-46df-a3a0-aac4bbab338c	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-07 17:11:07.656352+00	
00000000-0000-0000-0000-000000000000	8e452862-e9e5-4d6e-9828-8962618e9f3d	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-07 18:08:27.626853+00	
00000000-0000-0000-0000-000000000000	fb641378-f645-4210-b460-8e1cf071378a	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-07 18:08:42.838227+00	
00000000-0000-0000-0000-000000000000	0f8476eb-beb5-44a6-aa11-9282a0677cec	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-07 18:32:04.183624+00	
00000000-0000-0000-0000-000000000000	9306ce19-c1dd-4fe2-ace8-8d97c3f8577f	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-07 19:02:32.613918+00	
00000000-0000-0000-0000-000000000000	7001d30f-9989-4161-90cc-0d35489f4c40	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-07 20:30:34.79327+00	
00000000-0000-0000-0000-000000000000	befc4bb5-19b3-46b7-9ad3-d7e7c52b5146	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-07 20:30:34.819543+00	
00000000-0000-0000-0000-000000000000	b19c7d25-6b14-4150-b489-9e0c02cf8775	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-07 20:38:19.180435+00	
00000000-0000-0000-0000-000000000000	6a9171ab-1ddc-45b0-aafa-d8300d720111	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-07 20:38:19.190911+00	
00000000-0000-0000-0000-000000000000	3280b6fb-2f56-42c0-9cfe-f3374f31a02c	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-07 21:07:59.124833+00	
00000000-0000-0000-0000-000000000000	61d6257d-b3d9-4d86-8bbe-f2b58482bf15	{"action":"logout","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-07 21:14:01.816554+00	
00000000-0000-0000-0000-000000000000	9dd88eea-e5a3-440b-81b0-a9b4a5a90daf	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-07 21:46:15.563565+00	
00000000-0000-0000-0000-000000000000	6621be18-7180-400a-8a7a-3000582e8e18	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-07 21:46:15.578102+00	
00000000-0000-0000-0000-000000000000	cf7a57dc-46a1-4623-8b0c-caf694257b0d	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-07 21:46:20.087711+00	
00000000-0000-0000-0000-000000000000	2a620111-b80c-43df-956f-7f9cec7c84e3	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-08 12:20:10.201423+00	
00000000-0000-0000-0000-000000000000	b1059348-9cc1-41b3-9d16-3b8532a66b27	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-08 12:20:10.216103+00	
00000000-0000-0000-0000-000000000000	63e2f017-f366-456c-9b8d-b2670aded053	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-08 12:33:01.362658+00	
00000000-0000-0000-0000-000000000000	11ce5a80-0499-41d9-859e-cad79854b9d0	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-08 12:35:14.696076+00	
00000000-0000-0000-0000-000000000000	b2fdcbca-632c-4741-9466-c629965dd9ae	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-08 12:35:42.107004+00	
00000000-0000-0000-0000-000000000000	8dfe0563-484d-42d9-9d83-d95a17e41325	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-08 12:55:28.667652+00	
00000000-0000-0000-0000-000000000000	95d4af22-a9a3-4242-9df1-f971cd215255	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-08 12:59:42.603239+00	
00000000-0000-0000-0000-000000000000	e465f7b7-ba66-4115-801d-a4f4ee5c9f33	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-08 13:17:35.813932+00	
00000000-0000-0000-0000-000000000000	fa75e87d-4fc5-45c5-97a4-f4cf7c1834da	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-08 13:18:31.316579+00	
00000000-0000-0000-0000-000000000000	2e0ec5ad-5147-469e-bccb-b051216c4a04	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-08 13:18:31.321884+00	
00000000-0000-0000-0000-000000000000	fb66f3d0-60b7-4d22-85e0-2a1c4f377ebe	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-08 14:41:50.389659+00	
00000000-0000-0000-0000-000000000000	251ba97b-fec6-4648-9d24-42fcf10a7356	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-08 14:41:50.403628+00	
00000000-0000-0000-0000-000000000000	251dcfd9-f571-4a1e-92e6-75a2a4af2a23	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-08 14:50:53.296383+00	
00000000-0000-0000-0000-000000000000	0a68d408-ef5b-4ae0-a042-6730634a8687	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-08 14:50:53.301227+00	
00000000-0000-0000-0000-000000000000	88cde09b-1283-4965-bede-9918c2a57b3f	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-08 16:05:08.119731+00	
00000000-0000-0000-0000-000000000000	e4dec896-51e5-45ff-b47d-d54e62c743e7	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-08 16:05:08.142036+00	
00000000-0000-0000-0000-000000000000	c6d02f7c-b6a3-409c-a0fe-c37081fc0c52	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-08 16:27:18.822759+00	
00000000-0000-0000-0000-000000000000	f5b8e048-89cb-4ac4-9eb9-24efaec37cf7	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-08 16:27:30.619144+00	
00000000-0000-0000-0000-000000000000	bd363ec1-70a0-42f3-96f4-0fafc70d9ab0	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-08 16:35:44.016639+00	
00000000-0000-0000-0000-000000000000	f679380e-7146-4959-903a-cfed2077ceb5	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-08 16:35:44.028964+00	
00000000-0000-0000-0000-000000000000	6eb8130f-4dcb-4402-b64b-2d238bbdfd6c	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-08 17:42:53.675203+00	
00000000-0000-0000-0000-000000000000	5939e343-7796-4453-945f-e03809de181a	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-08 17:42:53.691509+00	
00000000-0000-0000-0000-000000000000	9029f4f1-ed4f-4bc6-b5ce-9086e8ff0779	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-08 19:31:18.539467+00	
00000000-0000-0000-0000-000000000000	08715e1f-ca81-4307-95a7-c991e85d0540	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-08 19:35:18.043617+00	
00000000-0000-0000-0000-000000000000	372ff69a-7d71-491c-9a07-a9e4e6828950	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-08 19:55:27.627185+00	
00000000-0000-0000-0000-000000000000	c7b50749-2378-454a-b26f-23ea90eabb24	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-08 20:39:27.150884+00	
00000000-0000-0000-0000-000000000000	8f19c121-ac11-4cb7-9391-9cb0d566d35c	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-08 20:39:27.169373+00	
00000000-0000-0000-0000-000000000000	911abeeb-e15a-4ac0-8eb4-55f886665267	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-08 20:42:03.082658+00	
00000000-0000-0000-0000-000000000000	8697dffa-b491-491d-8858-848bea9c5eae	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-08 20:47:46.855556+00	
00000000-0000-0000-0000-000000000000	9614e5e2-118b-4929-8b20-6706ec81eae8	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-08 21:10:10.343363+00	
00000000-0000-0000-0000-000000000000	d207c423-0a73-4b81-ac26-4ab31d22480f	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-08 21:31:02.250656+00	
00000000-0000-0000-0000-000000000000	18b58a33-024a-4e96-8e44-b705a92c552c	{"action":"token_refreshed","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-08 22:00:16.247957+00	
00000000-0000-0000-0000-000000000000	f5a8c959-ba51-4014-aa9d-139ebf68c6eb	{"action":"token_revoked","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-08 22:00:16.262031+00	
00000000-0000-0000-0000-000000000000	7264d3e8-24bf-4c32-8f03-75aa82ec3932	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-09 14:50:28.297302+00	
00000000-0000-0000-0000-000000000000	1dde9eab-8ec1-490f-8a9b-c8cda19bb0e8	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-09 14:50:46.036209+00	
00000000-0000-0000-0000-000000000000	76f0f19a-366f-45bc-b0ca-ef24094c0762	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-09 14:50:46.042268+00	
00000000-0000-0000-0000-000000000000	c2a70010-b10a-4fe5-8656-9d670f0db1f0	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-10 13:49:22.174999+00	
00000000-0000-0000-0000-000000000000	ec689da8-f867-4e9a-9a4c-ea9758a00334	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-10 14:44:12.429884+00	
00000000-0000-0000-0000-000000000000	5b45e648-fe6a-4bf5-b75e-d42b8839d5ec	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-10 17:32:03.239283+00	
00000000-0000-0000-0000-000000000000	d67d8632-aa7f-45a6-9f02-1bf4c4b2afb1	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-10 17:32:03.263592+00	
00000000-0000-0000-0000-000000000000	96329f1f-2486-44d5-a243-049b354cb681	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-10 18:09:18.945956+00	
00000000-0000-0000-0000-000000000000	b835f7e2-0016-4f53-acf0-61e8f1020817	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-10 18:13:39.203642+00	
00000000-0000-0000-0000-000000000000	f77a3dd0-a1a7-4bd3-9e3d-abed5f81cd7e	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-10 18:49:45.186+00	
00000000-0000-0000-0000-000000000000	1954543a-7dff-4d43-95da-714e88c04116	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-10 18:49:45.203436+00	
00000000-0000-0000-0000-000000000000	e1b8f35f-93d0-4feb-b79c-a30cde536fb3	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-10 19:11:45.602034+00	
00000000-0000-0000-0000-000000000000	60655982-a017-406e-93c0-73efe012ef53	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-10 19:11:45.617489+00	
00000000-0000-0000-0000-000000000000	767ffaf5-9392-4afa-83a0-b498b985a074	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-10 19:15:15.887424+00	
00000000-0000-0000-0000-000000000000	e555e244-2c23-4b00-9aca-67caebd7bb35	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-10 19:29:06.751597+00	
00000000-0000-0000-0000-000000000000	0b28b618-6614-46ee-9565-f368f84e97b7	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-10 19:30:01.121993+00	
00000000-0000-0000-0000-000000000000	8d3a396c-5482-47a7-b31c-e26170faa06f	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-10 20:01:15.242784+00	
00000000-0000-0000-0000-000000000000	9547b9da-10c9-4cf1-96b4-a42d35fb6a88	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-10 20:01:15.265825+00	
00000000-0000-0000-0000-000000000000	499040ef-9cbc-49db-8de5-335ea99d7e4c	{"action":"logout","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-10 20:01:18.327228+00	
00000000-0000-0000-0000-000000000000	f27c0355-04ff-4710-bb34-e0e4882eb50e	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-11 00:23:11.742163+00	
00000000-0000-0000-0000-000000000000	90313f2a-2562-4196-8438-b5ef6daa76e8	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-11 00:23:11.763027+00	
00000000-0000-0000-0000-000000000000	7a0a8d04-5839-4df5-8993-477eedeb8aee	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-11 00:31:38.4296+00	
00000000-0000-0000-0000-000000000000	9a181af7-5b71-413e-9b27-c4a4909feb51	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-11 00:31:38.432159+00	
00000000-0000-0000-0000-000000000000	056e9711-2067-4417-ab6d-351b65a70131	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-11 01:38:57.662239+00	
00000000-0000-0000-0000-000000000000	683f2ba3-f0f0-4a3e-94ef-a2ad0144b56a	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-11 01:38:57.682562+00	
00000000-0000-0000-0000-000000000000	47a6168b-cf2a-40b7-9b76-92b233c85803	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-11 12:07:07.974913+00	
00000000-0000-0000-0000-000000000000	1713a0c9-d8fe-49a3-9013-3ec9e3eb7469	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-11 12:07:07.990705+00	
00000000-0000-0000-0000-000000000000	b8b894e7-ff8f-438a-9c9b-d813e76c60f3	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-11 12:07:33.016978+00	
00000000-0000-0000-0000-000000000000	07b4214e-7893-4a05-93bf-83183eddbf4a	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-11 13:30:18.650498+00	
00000000-0000-0000-0000-000000000000	bb763c7e-26cb-413b-bb1d-e3a8686396a1	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-11 13:30:18.66739+00	
00000000-0000-0000-0000-000000000000	3c9ffff7-46bf-4cb6-b10f-9b2bb0cc13b0	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-11 14:03:48.863272+00	
00000000-0000-0000-0000-000000000000	73ce8707-399f-4b3b-af3f-31a0f64bda4c	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-11 14:03:48.880779+00	
00000000-0000-0000-0000-000000000000	da07a68e-0db9-4bf2-824b-f46c4513db34	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-11 15:11:00.854038+00	
00000000-0000-0000-0000-000000000000	05385703-e742-4e27-9a1f-34ef8b2208be	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-11 15:11:00.861412+00	
00000000-0000-0000-0000-000000000000	b7910bc0-b1f1-4111-99dd-84b5a72d7b53	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-11 16:34:27.303471+00	
00000000-0000-0000-0000-000000000000	7b5595ce-827a-448c-83dc-2c5dbb929c49	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-11 16:56:03.950197+00	
00000000-0000-0000-0000-000000000000	6f4ca906-c05e-4054-a86b-86704ff63598	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-11 18:34:08.45357+00	
00000000-0000-0000-0000-000000000000	0eb9a0a6-1a15-4c17-9d8c-825c82180d20	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-11 18:34:08.474161+00	
00000000-0000-0000-0000-000000000000	64f06817-784a-44e1-817d-6f1dfea68bd9	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-11 19:34:06.848826+00	
00000000-0000-0000-0000-000000000000	067959cc-e49c-4f43-b255-b48547f393b9	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-11 19:34:06.856726+00	
00000000-0000-0000-0000-000000000000	efb25181-7e18-4cf8-8167-de9de2143883	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-12 12:20:39.387801+00	
00000000-0000-0000-0000-000000000000	1c74b2e4-65a4-41ea-8641-983b2858da16	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-12 12:20:39.413849+00	
00000000-0000-0000-0000-000000000000	1c3d98fd-5785-4bb2-9b58-76cc6266e3e6	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-12 12:21:23.000229+00	
00000000-0000-0000-0000-000000000000	27572071-38a6-443e-9650-c52007a2b40e	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-12 13:20:15.950415+00	
00000000-0000-0000-0000-000000000000	c1fd56d4-274b-4bd6-88ad-f5c33ca95f85	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-12 13:20:15.962547+00	
00000000-0000-0000-0000-000000000000	37333558-4ebf-4e6d-be8f-ee73681f4815	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-12 14:35:52.000746+00	
00000000-0000-0000-0000-000000000000	e0ccc277-73f5-44b6-925f-2495d6853268	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-12 14:35:52.019594+00	
00000000-0000-0000-0000-000000000000	c9883c07-e9ff-4bf4-af82-395f530cc70e	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-12 15:59:45.859535+00	
00000000-0000-0000-0000-000000000000	bbfd5d8b-2a8d-4051-9af0-3952acb26a85	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-12 15:59:45.868266+00	
00000000-0000-0000-0000-000000000000	82174d35-13de-483a-af12-1940eb6ff6e9	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-12 17:33:26.122612+00	
00000000-0000-0000-0000-000000000000	13e0dca4-0d65-4565-b707-28b2e8a0c518	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-12 17:33:26.133978+00	
00000000-0000-0000-0000-000000000000	07aea2a7-c742-478c-b34d-0056f876b616	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-12 19:47:57.161152+00	
00000000-0000-0000-0000-000000000000	3c350fa7-c03a-44cb-9715-177da904ee34	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-12 19:47:57.17075+00	
00000000-0000-0000-0000-000000000000	be50b59a-7b74-4db5-8420-eeda042eb8be	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-12 19:53:53.804725+00	
00000000-0000-0000-0000-000000000000	1a649f16-0979-4e80-8eec-5a8dc8f14a79	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-12 19:53:53.812581+00	
00000000-0000-0000-0000-000000000000	4279a138-7639-4791-a5c0-dcbe47205d38	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-12 19:56:31.337918+00	
00000000-0000-0000-0000-000000000000	b92d18ff-9e50-4061-8453-9d72eb20ed5d	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-13 01:03:38.883487+00	
00000000-0000-0000-0000-000000000000	4f84f50c-7d65-45d5-b81d-860c7a7bf48b	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-13 01:03:38.90241+00	
00000000-0000-0000-0000-000000000000	6ef22292-29ee-4c10-b8fe-dddd8a1dd42f	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-13 12:06:32.743556+00	
00000000-0000-0000-0000-000000000000	434488f7-7cfa-4cad-a4bf-ef76717ec029	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-13 12:06:32.757491+00	
00000000-0000-0000-0000-000000000000	67389d80-2aad-4bc8-bda1-a86e8350ae45	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-13 12:50:01.126922+00	
00000000-0000-0000-0000-000000000000	77f05f24-094e-4e10-8db5-8ad46138b370	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-13 13:10:37.694487+00	
00000000-0000-0000-0000-000000000000	0bc3d987-3c70-414f-a57a-561b513b5d6b	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-13 13:10:37.709222+00	
00000000-0000-0000-0000-000000000000	3058a70f-b82b-42f4-8347-9e8a9c382fdf	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-13 14:14:28.520812+00	
00000000-0000-0000-0000-000000000000	bb9f0970-d29c-483d-a309-b956930a1658	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-13 14:14:28.528537+00	
00000000-0000-0000-0000-000000000000	e05666e2-0b42-469d-9025-8acc30d1ba17	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-13 15:23:17.712524+00	
00000000-0000-0000-0000-000000000000	ecc225ea-c460-4d5b-af25-afa0a23d2fb4	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-13 15:23:17.732806+00	
00000000-0000-0000-0000-000000000000	2b7f9409-3775-4e27-a111-57ff6e85434e	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-13 16:26:57.170948+00	
00000000-0000-0000-0000-000000000000	8683452c-4c48-49e5-8750-ac0dc0ff231a	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-13 16:26:57.188016+00	
00000000-0000-0000-0000-000000000000	0808045a-b0d2-4ec6-9ced-a90cf7bbda6d	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-13 16:49:29.040097+00	
00000000-0000-0000-0000-000000000000	319bb823-9cfc-488c-b1fd-131176d02b87	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-13 17:42:53.653595+00	
00000000-0000-0000-0000-000000000000	28d0e8f3-2293-405f-ac41-a537a716c21f	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-13 20:35:55.18913+00	
00000000-0000-0000-0000-000000000000	a9958e6c-fdcf-4506-969f-7e8c6f2f1d9d	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-13 20:41:31.772681+00	
00000000-0000-0000-0000-000000000000	0081ccf1-dceb-497d-a53f-b65faad9f3b3	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-13 21:43:57.024445+00	
00000000-0000-0000-0000-000000000000	7fa20a9c-5a73-4a27-a819-79da89279659	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-14 12:07:18.226945+00	
00000000-0000-0000-0000-000000000000	cd43db84-6733-4d7b-aea6-ac28b2acf8c0	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-14 12:07:18.250755+00	
00000000-0000-0000-0000-000000000000	df45bbd6-f2a7-4293-80b0-776510a5adc2	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-14 12:22:47.478885+00	
00000000-0000-0000-0000-000000000000	bc7c8245-240e-424a-a5e6-08527eda2b6a	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-14 13:47:22.946363+00	
00000000-0000-0000-0000-000000000000	d915a3f9-f49f-4bb5-aa27-e56ffb53a46f	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-14 13:47:22.961366+00	
00000000-0000-0000-0000-000000000000	47e2eadb-ab2d-48f8-89f9-ad99a82d5807	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-14 15:01:23.097403+00	
00000000-0000-0000-0000-000000000000	d06061da-6f7e-418b-be19-4cae0898cfa9	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-14 15:01:23.107506+00	
00000000-0000-0000-0000-000000000000	1f719f9e-1062-48b9-870b-4e6f7b47340d	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-14 15:42:20.390174+00	
00000000-0000-0000-0000-000000000000	48b06059-4c96-4cbc-9889-0df2b2480b11	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-14 15:42:20.40403+00	
00000000-0000-0000-0000-000000000000	bf87d076-4b45-464b-b129-c3e84cdf90c1	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-14 16:29:47.923694+00	
00000000-0000-0000-0000-000000000000	cef074ba-42e1-4267-95ff-cf40f91908ae	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-14 17:14:27.729224+00	
00000000-0000-0000-0000-000000000000	a5cf13bb-025e-4feb-aeb9-a6af216c8f8d	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-14 17:14:27.745081+00	
00000000-0000-0000-0000-000000000000	98fdda44-49b2-495a-b7a5-f415bac1b2a8	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-14 17:46:39.875488+00	
00000000-0000-0000-0000-000000000000	22903f1e-9af1-40f0-b1d4-2f8c68735fca	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-14 18:27:18.930035+00	
00000000-0000-0000-0000-000000000000	12fa23e9-2275-4ecb-a9a7-101400c18ff1	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-14 18:27:18.94377+00	
00000000-0000-0000-0000-000000000000	0b68be9b-0bcf-4b8b-b15a-38b6d6864fc7	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-14 18:37:16.32272+00	
00000000-0000-0000-0000-000000000000	24956764-3ddd-433b-83bf-6ae5292cbdf9	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-14 18:37:16.328287+00	
00000000-0000-0000-0000-000000000000	2595eada-4ee8-482f-b0cc-aedc7eb3ff9d	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-15 12:15:57.112215+00	
00000000-0000-0000-0000-000000000000	92aaaf0c-e316-42c5-a3a1-3950834547d3	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-15 12:15:57.136498+00	
00000000-0000-0000-0000-000000000000	f78f316e-068d-48ef-93b6-0a1dd14e47b2	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-15 12:27:16.030859+00	
00000000-0000-0000-0000-000000000000	b187f8fa-9aad-4549-ba15-321eb825c738	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-15 13:06:06.99504+00	
00000000-0000-0000-0000-000000000000	3e81b85c-8990-4c1e-a53c-33812399dd78	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-15 13:23:49.788878+00	
00000000-0000-0000-0000-000000000000	3962d977-3371-4d46-a239-05a9ae831468	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-15 13:23:49.812748+00	
00000000-0000-0000-0000-000000000000	410b0af4-a361-4111-ae12-ad8b879d33ad	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-15 14:02:00.281446+00	
00000000-0000-0000-0000-000000000000	16e919ba-d59b-4b7d-a039-273202768ff5	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-15 14:52:49.454031+00	
00000000-0000-0000-0000-000000000000	88d94f25-888b-4dc8-ad5c-57b8544fbeb0	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-15 14:52:49.472706+00	
00000000-0000-0000-0000-000000000000	0699cd22-3a4f-4d4c-b1f1-4a0d5e7f07f3	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-15 15:15:48.381385+00	
00000000-0000-0000-0000-000000000000	5e875ca2-5e3c-4dc0-aad9-f864317ad915	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-15 15:34:36.783172+00	
00000000-0000-0000-0000-000000000000	71c3ec08-9539-4eb6-a907-664fcd4fa57c	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-15 15:34:36.795022+00	
00000000-0000-0000-0000-000000000000	a6874559-b67d-472b-b71b-bdeccf3465da	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-15 15:37:04.109141+00	
00000000-0000-0000-0000-000000000000	a820934a-ff8a-4461-93cd-4d7b19774a37	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-15 15:42:16.653533+00	
00000000-0000-0000-0000-000000000000	91a0a246-4447-47f3-b523-6c7e0830b241	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-15 17:17:45.906774+00	
00000000-0000-0000-0000-000000000000	978ebb97-f2b3-45c8-bc05-0bbe0e233f8b	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-15 17:17:45.920586+00	
00000000-0000-0000-0000-000000000000	ae14ad47-3868-41fc-9f04-66136701306d	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-15 17:32:58.699383+00	
00000000-0000-0000-0000-000000000000	7cbe4102-5eb6-4ecd-a3f8-63fc6ab0a6a8	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-15 17:32:58.703555+00	
00000000-0000-0000-0000-000000000000	f811fb78-f63a-408f-b546-839dfb6c5443	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-15 19:21:47.79354+00	
00000000-0000-0000-0000-000000000000	11d1f7f6-b474-4b3c-aa26-5f2bc95e8a66	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-15 19:21:47.815627+00	
00000000-0000-0000-0000-000000000000	c71e7dcb-e898-45cf-8a16-c60d10b051fa	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-16 11:18:31.986201+00	
00000000-0000-0000-0000-000000000000	8deb3d9e-780a-48c0-802b-2cc3086fda04	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-16 15:13:09.454774+00	
00000000-0000-0000-0000-000000000000	d561584e-5dfd-4e2b-85c3-e6459c4f1806	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-16 18:18:54.130194+00	
00000000-0000-0000-0000-000000000000	d06c48d9-01bd-4645-adb8-1c16e9570e85	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-16 18:18:54.15226+00	
00000000-0000-0000-0000-000000000000	e7b8d26d-95c4-4c8b-82d0-f1350e6e1f16	{"action":"logout","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-16 18:25:51.717891+00	
00000000-0000-0000-0000-000000000000	e8596ff0-3704-4b9f-8c67-0bd9903cc521	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-16 20:23:59.778616+00	
00000000-0000-0000-0000-000000000000	c361066c-fe6a-4735-81fa-3b9b94768230	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-16 20:23:59.808289+00	
00000000-0000-0000-0000-000000000000	f2d1bffa-eacd-429d-94fb-d5722cfe71bb	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-16 20:23:59.810664+00	
00000000-0000-0000-0000-000000000000	e8f1acd0-ae96-4bc7-98a2-ce1ece402122	{"action":"logout","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account"}	2026-05-16 20:23:59.953369+00	
00000000-0000-0000-0000-000000000000	bdd7bcbb-3e02-4100-8538-bf0bf5941afb	{"action":"logout","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-16 20:30:06.354441+00	
00000000-0000-0000-0000-000000000000	b59f9a82-33df-4ccb-ad06-50051c686e9b	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-16 20:34:02.947539+00	
00000000-0000-0000-0000-000000000000	418dc26c-7b57-4eb9-af1e-cbe318513bd0	{"action":"logout","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-16 20:41:28.790744+00	
00000000-0000-0000-0000-000000000000	2ba0e949-e545-42a6-8fac-181f866d609d	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-16 22:53:27.817898+00	
00000000-0000-0000-0000-000000000000	f831d742-a93a-4061-b9ae-4d8fe9891fef	{"action":"logout","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account"}	2026-05-16 22:58:29.253843+00	
00000000-0000-0000-0000-000000000000	6447ab81-0095-4707-bab1-ffe26c2f02b4	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-17 14:51:50.964273+00	
00000000-0000-0000-0000-000000000000	0e30e630-3138-428f-a012-3bf164af9cd0	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-17 15:29:40.215979+00	
00000000-0000-0000-0000-000000000000	6dbec603-97d3-408d-ab43-8f315a6e3f48	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-17 17:51:23.69318+00	
00000000-0000-0000-0000-000000000000	4d7d6b13-37b1-4cc9-8267-4747e4fd6d40	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-17 17:53:33.243804+00	
00000000-0000-0000-0000-000000000000	3ecf3b1e-659c-4642-a126-c9a9bfc4e571	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-17 19:11:18.906001+00	
00000000-0000-0000-0000-000000000000	9fc424c0-1d4f-4de3-8cae-eff84945b013	{"action":"logout","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-17 19:17:22.393978+00	
00000000-0000-0000-0000-000000000000	ca6c8765-2254-4808-9e6d-0c5b071d0dc7	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-17 19:17:34.092414+00	
00000000-0000-0000-0000-000000000000	a41d1086-26c1-42a4-a679-adcc7b9e07a6	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-17 19:18:44.335972+00	
00000000-0000-0000-0000-000000000000	a570601d-67ad-457d-a27a-8828c31fa4f9	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-18 12:16:34.076115+00	
00000000-0000-0000-0000-000000000000	21757be8-8ecd-4a8c-aa2e-de7c1e2906c3	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-18 12:16:34.096572+00	
00000000-0000-0000-0000-000000000000	4a6fee9d-b791-4048-9ee3-2f6c90f00a49	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-18 12:19:42.099191+00	
00000000-0000-0000-0000-000000000000	01552e6d-7a32-4af5-8886-af3975c67402	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-18 12:40:45.601086+00	
00000000-0000-0000-0000-000000000000	f9810a0d-bd29-469e-b369-ac5f65cac669	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-18 13:38:59.915877+00	
00000000-0000-0000-0000-000000000000	f8b65955-06c1-4aa6-843f-856c6edd7db6	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-18 13:38:59.925404+00	
00000000-0000-0000-0000-000000000000	00a30e8c-f9f9-4ea1-a1e9-d5d781e6034c	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-18 14:25:46.2244+00	
00000000-0000-0000-0000-000000000000	db019989-9c14-4b02-9d5f-f76d8574cfef	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-18 14:25:46.234687+00	
00000000-0000-0000-0000-000000000000	4f516ed6-996f-488e-b57a-b6ad390aa282	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-18 14:34:08.454113+00	
00000000-0000-0000-0000-000000000000	7021c188-ec23-4675-9fe9-3c67310654c8	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-18 14:34:08.463357+00	
00000000-0000-0000-0000-000000000000	5a44dffe-4ca6-4c50-891d-c173d7a168eb	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-18 14:36:13.642876+00	
00000000-0000-0000-0000-000000000000	a7f9f927-2330-4c62-a66a-93f8e254a861	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-18 14:44:57.648535+00	
00000000-0000-0000-0000-000000000000	65f6da03-ebb2-433e-b35c-6a85f40402ce	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-18 14:54:26.750523+00	
00000000-0000-0000-0000-000000000000	55a58adb-3bea-4f5a-a4ed-892587718233	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-18 14:54:26.75422+00	
00000000-0000-0000-0000-000000000000	d0e8ab62-03bf-45e4-8cb1-0f8b51b22994	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-18 15:00:38.893225+00	
00000000-0000-0000-0000-000000000000	dd759a31-350f-49c7-b274-1821ab753570	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-18 15:02:00.628747+00	
00000000-0000-0000-0000-000000000000	5b6ded08-ce28-4799-a6fb-59e1e5424bbe	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-18 15:02:32.447169+00	
00000000-0000-0000-0000-000000000000	4ab9999f-fcf0-403b-8eb1-5bf18f2aaa54	{"action":"logout","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-18 15:03:53.752751+00	
00000000-0000-0000-0000-000000000000	fbc41b62-38c4-4046-9159-9e7b2cc5305b	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-18 15:23:19.237977+00	
00000000-0000-0000-0000-000000000000	683d13e5-3f30-4118-a943-7371aec463c9	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-18 15:26:01.46861+00	
00000000-0000-0000-0000-000000000000	d1c3af2f-522b-46ac-9d1b-f0012735342d	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-18 15:56:26.663399+00	
00000000-0000-0000-0000-000000000000	429f03a9-789d-4afe-acfe-c549ac1702d8	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-18 15:56:42.682539+00	
00000000-0000-0000-0000-000000000000	47b5f7d4-b935-49a1-8dfb-7421d599bee4	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-18 15:56:42.686348+00	
00000000-0000-0000-0000-000000000000	fa58a070-2fd6-45d2-abf3-51d48396a3e4	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-18 16:01:21.419729+00	
00000000-0000-0000-0000-000000000000	d838db44-9a78-4a24-80a8-e7a012de3f83	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-18 16:01:21.424286+00	
00000000-0000-0000-0000-000000000000	b7ac3721-9783-4caf-9b9d-177afbc2f59c	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-18 16:05:21.524719+00	
00000000-0000-0000-0000-000000000000	59ec2dcf-d2de-4d95-b9e5-4b4d69106414	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-18 16:05:21.531586+00	
00000000-0000-0000-0000-000000000000	75b1307c-24bc-4efc-b62e-b45d88622c5a	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-18 16:10:18.615861+00	
00000000-0000-0000-0000-000000000000	b6ed6ae9-934f-4a86-8eb9-91e793019d40	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-18 16:38:19.212722+00	
00000000-0000-0000-0000-000000000000	0d38a0d0-f60a-4a56-8309-5d9b5cf74e14	{"action":"logout","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-18 16:53:15.510023+00	
00000000-0000-0000-0000-000000000000	476891ae-30fa-45e4-a0ca-ff3d93870e3a	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-18 16:59:25.280917+00	
00000000-0000-0000-0000-000000000000	fa79c970-892d-448b-a7ad-17a9225c635b	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-18 17:02:48.91495+00	
00000000-0000-0000-0000-000000000000	4fb069d4-b341-47d9-90a3-e0af51b9c699	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-18 17:05:57.158269+00	
00000000-0000-0000-0000-000000000000	b9fe4723-a5b5-4119-8666-eaea8f01719b	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-18 17:12:42.943169+00	
00000000-0000-0000-0000-000000000000	22af26af-a0ac-4511-90c4-09194d617f23	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-18 19:34:40.457034+00	
00000000-0000-0000-0000-000000000000	3d44609e-7f47-47f2-935e-a60af482c2a6	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-18 19:34:40.457187+00	
00000000-0000-0000-0000-000000000000	4723e098-7ea3-4607-854f-5492880d9d2b	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-18 19:34:40.47627+00	
00000000-0000-0000-0000-000000000000	12dcc036-030a-44a0-8386-1ac94db8e727	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-18 19:34:40.475945+00	
00000000-0000-0000-0000-000000000000	dc324eec-cdc7-4420-97df-bba6c70b5060	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-18 19:35:11.554122+00	
00000000-0000-0000-0000-000000000000	269e9a6c-3526-4d88-9d5f-271ace713864	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-18 19:55:00.552788+00	
00000000-0000-0000-0000-000000000000	053bea0b-f19d-427c-a39e-4f1bf41c2b1d	{"action":"logout","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-18 19:55:00.55254+00	
00000000-0000-0000-0000-000000000000	051c6731-31e1-4e06-b1ee-0585cc447caf	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-18 21:15:04.980067+00	
00000000-0000-0000-0000-000000000000	47477715-f2d0-4c23-9b54-0171e80bb4c6	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-18 22:18:30.62637+00	
00000000-0000-0000-0000-000000000000	e2ddb584-3e67-4a39-94b4-98f404cb90d2	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-18 22:18:30.638873+00	
00000000-0000-0000-0000-000000000000	6cf93417-44df-40fc-83ff-70f9426b4194	{"action":"logout","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account"}	2026-05-18 22:18:30.835475+00	
00000000-0000-0000-0000-000000000000	7af8d834-fa9a-4837-a99c-41af9bcbb733	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-18 22:25:54.773387+00	
00000000-0000-0000-0000-000000000000	28a0b010-c9bc-4aa2-a931-c436c2e946fd	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-19 11:58:07.909148+00	
00000000-0000-0000-0000-000000000000	f3c6b2a8-d7c7-46db-839d-d253b3415719	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-19 11:58:07.932858+00	
00000000-0000-0000-0000-000000000000	c90b4280-5cc2-4722-9095-87d357aea326	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-19 12:51:59.584865+00	
00000000-0000-0000-0000-000000000000	8e6da937-045c-489c-bbb4-053bc39d85d8	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-19 12:54:30.18675+00	
00000000-0000-0000-0000-000000000000	8a948260-b93d-4fc1-a721-846fe77378e8	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-19 12:55:21.238838+00	
00000000-0000-0000-0000-000000000000	f0b4c0ac-4224-4d0d-b1cb-013e5da4290e	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-19 13:19:26.619043+00	
00000000-0000-0000-0000-000000000000	c6a5a2b7-7dda-4baf-ad37-603d53261fae	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-19 13:55:22.028068+00	
00000000-0000-0000-0000-000000000000	aa5bcee5-f77f-4a18-98b4-c72301e41c41	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-19 13:55:22.048507+00	
00000000-0000-0000-0000-000000000000	9999daeb-9c6c-42a8-8bc4-0558155e3e6c	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-19 14:03:57.367517+00	
00000000-0000-0000-0000-000000000000	82aa2e6c-f94b-47a9-9453-76a51cc04dde	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-19 14:03:57.378054+00	
00000000-0000-0000-0000-000000000000	3efe7524-69c4-4d52-ad04-a117274d00e9	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-19 14:08:20.991706+00	
00000000-0000-0000-0000-000000000000	0e126973-3f6a-4692-8fcd-6d260612a9ea	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-19 14:08:20.996584+00	
00000000-0000-0000-0000-000000000000	b695bc84-ca88-4be1-86dc-f6157ed26972	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-19 14:59:06.00673+00	
00000000-0000-0000-0000-000000000000	4dc1eade-7639-4e08-8f2c-43994c78d11e	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-19 15:04:16.171173+00	
00000000-0000-0000-0000-000000000000	2c01455a-a9cf-4637-9411-2c3dfc9fb6e8	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-19 15:04:16.183063+00	
00000000-0000-0000-0000-000000000000	5b4a856b-ec49-4f33-87ff-c9c548dc0171	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-19 15:09:21.243808+00	
00000000-0000-0000-0000-000000000000	1b906531-76ed-4e87-83bd-58c78e3554be	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-19 15:09:21.245704+00	
00000000-0000-0000-0000-000000000000	1e06f595-d70a-4b93-9109-568001b97b04	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-19 15:30:58.515097+00	
00000000-0000-0000-0000-000000000000	7c61cb11-5b7e-4a6f-8ad8-14649e16b9ef	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-19 15:33:48.271855+00	
00000000-0000-0000-0000-000000000000	c0e7b6f6-dd44-4709-a5a6-534c3fd8198e	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-19 17:38:41.161566+00	
00000000-0000-0000-0000-000000000000	cc59798e-27c5-4281-8ef7-74c4f803035f	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-19 17:38:41.180022+00	
00000000-0000-0000-0000-000000000000	4e4f19b5-8606-451a-8a70-c17200b21400	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-19 17:51:47.716249+00	
00000000-0000-0000-0000-000000000000	78dd74ae-dd10-4806-8c12-2c8a7979499d	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-19 18:12:39.947015+00	
00000000-0000-0000-0000-000000000000	c369fd58-52dd-463c-9817-6c1e8083d1ba	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-19 18:12:39.967376+00	
00000000-0000-0000-0000-000000000000	64d430da-4afb-4016-a2d2-62721e9633ce	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-19 20:56:40.728302+00	
00000000-0000-0000-0000-000000000000	7816fc37-3858-4384-8f24-275c09fc9274	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-19 22:05:44.618551+00	
00000000-0000-0000-0000-000000000000	ccd04e24-3572-4de7-adcc-36fc87e870f5	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-19 22:05:44.634016+00	
00000000-0000-0000-0000-000000000000	3dd01a64-0e1f-4005-8122-f2c9dd68c71e	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-20 12:05:10.757517+00	
00000000-0000-0000-0000-000000000000	d5890789-863a-42d2-99fc-1dba4613dba7	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-20 12:05:10.783513+00	
00000000-0000-0000-0000-000000000000	32a80286-8ad9-4c8f-8a92-cb74ff1445a0	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-20 13:26:51.214241+00	
00000000-0000-0000-0000-000000000000	2990d604-77d8-4465-84e1-538addc78e2c	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-20 13:26:51.230549+00	
00000000-0000-0000-0000-000000000000	14bb0a68-285f-4fc4-8d7d-af202cf81c94	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-20 13:42:56.946906+00	
00000000-0000-0000-0000-000000000000	84f93a6a-1775-4aa6-ad3a-57d096254dc5	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-20 13:42:56.951433+00	
00000000-0000-0000-0000-000000000000	61f78de7-a41e-49ba-8901-5a5da3a07bc1	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-20 14:02:15.250535+00	
00000000-0000-0000-0000-000000000000	0f099d09-1f2b-4140-bf54-c4e5b0a9e2f3	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-20 14:15:57.000901+00	
00000000-0000-0000-0000-000000000000	8a04f1c6-86db-4763-8e59-6787734bc956	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-20 14:19:22.316991+00	
00000000-0000-0000-0000-000000000000	61335152-78e6-4290-bfed-ba123d191114	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-20 14:38:34.974967+00	
00000000-0000-0000-0000-000000000000	fe91cea9-7837-4f07-96ed-6ccc1636628c	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-20 15:07:07.047841+00	
00000000-0000-0000-0000-000000000000	fc112814-2746-4606-a054-2688099357a1	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-20 15:07:07.062078+00	
00000000-0000-0000-0000-000000000000	36f39ecf-6633-458f-9c4e-fc3a236bcece	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-20 16:08:30.656258+00	
00000000-0000-0000-0000-000000000000	de1582f4-dde3-458c-96a6-0defc236d02d	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-20 16:08:30.669318+00	
00000000-0000-0000-0000-000000000000	e97b2cd6-849d-4e6e-8aa6-849ead00bcb2	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-21 12:07:59.967021+00	
00000000-0000-0000-0000-000000000000	db0a33bf-9046-4f2c-bb9b-e40808a25a06	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-21 12:07:59.986325+00	
00000000-0000-0000-0000-000000000000	93a94b36-fb15-478b-b597-99f2f015014c	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-21 12:42:12.829755+00	
00000000-0000-0000-0000-000000000000	74153dbe-070b-4c99-aed0-7b30efb591bc	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-21 13:06:20.493522+00	
00000000-0000-0000-0000-000000000000	7af579dc-523a-4962-b0cc-c5142d91c434	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-21 13:06:20.503571+00	
00000000-0000-0000-0000-000000000000	400266e9-4c9d-4a51-832a-d3281aa11abd	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-21 13:12:53.031237+00	
00000000-0000-0000-0000-000000000000	32066a08-02f7-462b-afe6-4b4a5e5c8823	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-21 13:12:53.034196+00	
00000000-0000-0000-0000-000000000000	29400d7a-c9c9-4ca6-b6bb-f93d2fbadac5	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-21 14:33:54.714284+00	
00000000-0000-0000-0000-000000000000	f26c7ba5-c15e-4b03-830a-201946ba5f43	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-21 14:33:54.736611+00	
00000000-0000-0000-0000-000000000000	5fe6f329-c24e-425a-bdd9-1962c9c8b524	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-21 15:11:38.401712+00	
00000000-0000-0000-0000-000000000000	8210074e-c5cd-4405-9e51-0234fdf05680	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-21 15:11:38.412163+00	
00000000-0000-0000-0000-000000000000	a9bf5b2a-a544-46bf-9311-09d5df1b2c07	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-21 15:28:14.364001+00	
00000000-0000-0000-0000-000000000000	23769c46-1912-4bce-9cc5-4237087b27dd	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-21 15:28:14.375981+00	
00000000-0000-0000-0000-000000000000	2b80caae-2082-4cac-bf88-54a5c349f0e5	{"action":"logout","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account"}	2026-05-21 15:28:14.534131+00	
00000000-0000-0000-0000-000000000000	e87c7785-9fc2-470a-a762-f3d19103ecbf	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-21 16:13:44.521026+00	
00000000-0000-0000-0000-000000000000	8195e1d7-020a-40d2-979a-74d9c627ca2a	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-21 17:18:24.001623+00	
00000000-0000-0000-0000-000000000000	23a2b8ab-2f69-4dc9-baf3-cabe38a98ff5	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-21 17:20:59.742699+00	
00000000-0000-0000-0000-000000000000	f9a0b0c5-891c-4faf-99b9-c0592d90fdec	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-21 18:00:25.058311+00	
00000000-0000-0000-0000-000000000000	235fdf57-facd-4777-9b46-f121e23dbdb5	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-21 18:01:36.74538+00	
00000000-0000-0000-0000-000000000000	4732113b-1c19-4265-875b-7b90c2dcb915	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-21 18:28:29.739135+00	
00000000-0000-0000-0000-000000000000	d9af092e-ee0d-4fba-9569-8d180d444410	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-21 18:33:03.604324+00	
00000000-0000-0000-0000-000000000000	5edd7dcf-3885-4c18-8d5b-a1a0f6cb94f7	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-21 18:37:24.038578+00	
00000000-0000-0000-0000-000000000000	9f1816b1-72da-4ac3-b277-29b80974c497	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-21 18:40:23.487781+00	
00000000-0000-0000-0000-000000000000	f6cec229-61f0-43b3-9bf7-42e7cb280a3a	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-21 18:40:29.096095+00	
00000000-0000-0000-0000-000000000000	6a42ae56-aa8c-4f93-b11f-5b5abb93f8c1	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-21 18:40:38.213101+00	
00000000-0000-0000-0000-000000000000	93d6a827-98e7-465d-ab33-8258440e312f	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-21 18:40:44.317805+00	
00000000-0000-0000-0000-000000000000	def4d598-b178-4839-b4cc-c57cc2042240	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-21 18:44:34.245542+00	
00000000-0000-0000-0000-000000000000	7eada8d0-7da5-45f0-a6b8-5c0a7e66d832	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-21 18:45:10.852015+00	
00000000-0000-0000-0000-000000000000	7a3f7152-c2ca-42ad-a7a3-5866e0b23e45	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-21 18:45:21.048292+00	
00000000-0000-0000-0000-000000000000	5fb426db-eb53-450d-9cd4-699a4671dceb	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-21 20:50:39.996831+00	
00000000-0000-0000-0000-000000000000	a79d366a-eaf4-4f38-9a0e-9b9d77ad2ba3	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-21 21:43:00.213872+00	
00000000-0000-0000-0000-000000000000	76428896-3a11-4480-bc46-fb89045ad02a	{"action":"logout","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-21 21:47:15.36627+00	
00000000-0000-0000-0000-000000000000	15ffac06-16a1-4b94-af2f-23bead7aa29d	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-21 23:14:49.092306+00	
00000000-0000-0000-0000-000000000000	2f01cc27-2b82-49af-a457-6da195fc5732	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-22 12:07:50.618877+00	
00000000-0000-0000-0000-000000000000	d8593d04-a5b5-47a0-b559-02cb32309a33	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-22 12:07:50.641828+00	
00000000-0000-0000-0000-000000000000	8f54eb4c-0585-4ee3-9fdd-2f254b6801b6	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-22 13:06:16.960975+00	
00000000-0000-0000-0000-000000000000	81b4dcf6-b484-4426-9384-bd956cb7cabd	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-22 13:06:16.970447+00	
00000000-0000-0000-0000-000000000000	12c5c398-5416-40df-8383-d3805064354d	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-22 13:39:49.097863+00	
00000000-0000-0000-0000-000000000000	34119565-f66d-40e1-bdf2-d2a874ba7a63	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-22 13:39:49.109981+00	
00000000-0000-0000-0000-000000000000	8acb35d1-1838-4228-ad24-b232cd4eeb3f	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-22 14:30:34.31648+00	
00000000-0000-0000-0000-000000000000	100b7da2-0835-4251-ac9c-af197390d45b	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-22 14:30:34.332967+00	
00000000-0000-0000-0000-000000000000	6f9703a9-3433-4737-a1ff-5315ae289090	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 15:32:46.454777+00	
00000000-0000-0000-0000-000000000000	6be49b16-0b16-4863-a1d9-6892dc9b91e6	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 15:52:13.408542+00	
00000000-0000-0000-0000-000000000000	7229db4b-71e5-492b-8335-7ba495bb7d24	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-22 16:05:53.844792+00	
00000000-0000-0000-0000-000000000000	00bdc323-11fc-4cc7-bada-ffff0990060e	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 16:08:06.862478+00	
00000000-0000-0000-0000-000000000000	f9fb0ce9-1788-4e7d-b0f2-8670084802f4	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 16:09:55.55443+00	
00000000-0000-0000-0000-000000000000	b8d8c87d-1294-4ef7-a5ec-71350612e333	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-22 16:10:26.683968+00	
00000000-0000-0000-0000-000000000000	7f3ba086-bf34-4936-ad1e-a017660b976e	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-22 16:10:26.687834+00	
00000000-0000-0000-0000-000000000000	371a2f25-82a9-4fcb-b87c-ee69bea5e231	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-22 16:12:02.10864+00	
00000000-0000-0000-0000-000000000000	f133248c-d316-42ff-ac1c-7af4eb40b4e7	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-22 16:12:02.110105+00	
00000000-0000-0000-0000-000000000000	60a884f8-6e95-4ed2-a120-92c5eab02f74	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 16:22:19.598218+00	
00000000-0000-0000-0000-000000000000	b525a0ef-46f6-4c73-b6bb-0d83cc7b0470	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 16:28:51.315799+00	
00000000-0000-0000-0000-000000000000	dfb8d80e-ef24-47dc-b84c-fb1b4b16e52b	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 16:28:55.836287+00	
00000000-0000-0000-0000-000000000000	e502be8d-2320-4fb0-b28f-af34133b7fa5	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 16:30:29.905247+00	
00000000-0000-0000-0000-000000000000	a7cbccea-3f8b-44c4-b328-4b3bcc903284	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 16:32:30.952881+00	
00000000-0000-0000-0000-000000000000	3e002c20-b295-450f-95c1-890a8db7b132	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 16:39:29.954304+00	
00000000-0000-0000-0000-000000000000	4325a3f8-f683-4468-913c-6dd12ebdaeec	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-22 16:41:03.158571+00	
00000000-0000-0000-0000-000000000000	a242906b-f193-414a-bf90-2d2955fefe46	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 16:45:43.133182+00	
00000000-0000-0000-0000-000000000000	672419c1-d7c9-4c7f-a47a-8d7c68d78361	{"action":"logout","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-22 16:52:54.845473+00	
00000000-0000-0000-0000-000000000000	4aa3b6e3-b179-4194-a182-1b3abd5dc1db	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 16:55:13.478628+00	
00000000-0000-0000-0000-000000000000	8ff60ad4-6568-4a48-bb97-c5c0adb4b838	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 16:58:46.440241+00	
00000000-0000-0000-0000-000000000000	33de7f0b-3357-4504-aecf-b54e0a0f6a97	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 17:02:38.809897+00	
00000000-0000-0000-0000-000000000000	d6ff15a9-21ac-4e32-8ccb-ac260455a9aa	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 17:02:40.642165+00	
00000000-0000-0000-0000-000000000000	d0cbf88d-9d86-4d0c-9c36-8367c6782aa8	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 17:05:22.64728+00	
00000000-0000-0000-0000-000000000000	91f30205-34cd-4a4f-afea-983396214b14	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 17:19:28.491094+00	
00000000-0000-0000-0000-000000000000	e257629f-19df-4e6f-8bae-a115e344f5d5	{"action":"login","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 17:20:38.636652+00	
00000000-0000-0000-0000-000000000000	153d2de5-db12-420d-88da-b1da113a36f4	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 17:35:20.564203+00	
00000000-0000-0000-0000-000000000000	8470e79b-35c4-4969-88ad-7d008b24a49f	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-22 17:43:17.768504+00	
00000000-0000-0000-0000-000000000000	e91fcd37-d2f5-4928-a74a-fa7d29a5d903	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 17:48:46.750468+00	
00000000-0000-0000-0000-000000000000	6a06d27c-7289-4959-9c11-7d3fa49aaf90	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 17:49:20.044112+00	
00000000-0000-0000-0000-000000000000	884722f7-509f-4b61-9cfe-d518083fc521	{"action":"logout","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-22 17:49:29.081245+00	
00000000-0000-0000-0000-000000000000	60add404-c44d-4eb1-a92c-81c1d589b338	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 17:49:38.213696+00	
00000000-0000-0000-0000-000000000000	ac051be0-8466-4229-b2b3-089bd252604e	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-22 17:50:17.47068+00	
00000000-0000-0000-0000-000000000000	523a4280-55ec-4c21-ae3f-303b17ae1642	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 17:50:43.472745+00	
00000000-0000-0000-0000-000000000000	0bc205f9-2f58-43ce-8046-8a3b380b1d93	{"action":"login","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 17:50:59.646595+00	
00000000-0000-0000-0000-000000000000	dc51d7cb-73ce-4661-a894-ce9c8fd710f9	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 17:57:37.077418+00	
00000000-0000-0000-0000-000000000000	f75a6638-a249-4bbd-b4ee-255bfaabb4f1	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 18:09:42.199657+00	
00000000-0000-0000-0000-000000000000	7f4d074c-8659-49ef-ae66-85724b643e47	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-22 18:16:10.332797+00	
00000000-0000-0000-0000-000000000000	817f05f7-e993-4bb6-98af-6956b22db4da	{"action":"token_refreshed","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-22 19:49:56.371612+00	
00000000-0000-0000-0000-000000000000	e9e5f94b-425c-413e-a726-41ebc28f1cd4	{"action":"token_revoked","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-22 19:49:56.386903+00	
00000000-0000-0000-0000-000000000000	ecdbd314-da9d-40bb-9951-708da23900b4	{"action":"token_refreshed","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-22 20:16:04.349842+00	
00000000-0000-0000-0000-000000000000	bb9cd973-ede0-4f97-bfc7-3e47ffbc902b	{"action":"token_revoked","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-22 20:16:04.352864+00	
00000000-0000-0000-0000-000000000000	221c217c-ca46-42b7-9dda-e18f74693235	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-22 20:40:57.374175+00	
00000000-0000-0000-0000-000000000000	abf95839-0e25-4cc6-884f-4f30f0f9958f	{"action":"token_refreshed","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-22 22:04:38.569914+00	
00000000-0000-0000-0000-000000000000	66852b8b-b37c-4977-a0ab-66bf0b2e2cb3	{"action":"token_revoked","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-22 22:04:38.584981+00	
00000000-0000-0000-0000-000000000000	8f88a93c-c2af-4c56-a2d4-1c76e2023e5f	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-23 11:52:56.530257+00	
00000000-0000-0000-0000-000000000000	53bd8d0e-d1ce-4bca-b19d-df1b7bdbe0b4	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-23 11:59:27.271395+00	
00000000-0000-0000-0000-000000000000	aa463c0c-a788-469a-b9c8-9ee704b5f752	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-23 14:42:01.021795+00	
00000000-0000-0000-0000-000000000000	6e31cef8-78ff-4ea9-a180-2a72f0d913e5	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-23 14:42:13.706747+00	
00000000-0000-0000-0000-000000000000	7327eeec-9fd7-4c52-a4d2-1fc3e870b5fb	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-23 16:37:20.929429+00	
00000000-0000-0000-0000-000000000000	08a799c1-3b70-4323-abaf-e3405967857e	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-23 16:42:40.683585+00	
00000000-0000-0000-0000-000000000000	0ce4b92d-6675-4694-ab37-472d68ba47db	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-23 21:35:25.327835+00	
00000000-0000-0000-0000-000000000000	837920f6-ba53-4a46-92c8-80081d3b3bae	{"action":"logout","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-23 21:40:43.888701+00	
00000000-0000-0000-0000-000000000000	da5707b7-5c8c-4683-805c-22ac44c73c7d	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-24 00:22:05.907189+00	
00000000-0000-0000-0000-000000000000	35612a28-e8ea-4e02-be16-ec4470bf0085	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-24 00:22:05.929944+00	
00000000-0000-0000-0000-000000000000	21decdf4-9504-4d6f-9c19-5f7d0a4df8e6	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-24 12:12:59.113902+00	
00000000-0000-0000-0000-000000000000	ae70e774-bcda-4de0-bc27-829b431d14b8	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-24 12:12:59.131994+00	
00000000-0000-0000-0000-000000000000	dec5e8d0-4345-4300-a7f1-52f7fe518c9a	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-24 12:56:25.280293+00	
00000000-0000-0000-0000-000000000000	4460212e-4763-4185-b42f-3f6c80ea87d5	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-24 13:35:24.609+00	
00000000-0000-0000-0000-000000000000	0e5e4607-c4e9-4fc7-b7d7-fe1efb62c190	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-24 16:52:05.113394+00	
00000000-0000-0000-0000-000000000000	fdcb33db-b2a4-4b11-96f1-ac18fbb2fef5	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-24 16:52:45.154178+00	
00000000-0000-0000-0000-000000000000	05ad61fb-762a-4ed6-8b7f-28fb9fb75738	{"action":"login","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-24 17:18:51.558893+00	
00000000-0000-0000-0000-000000000000	99f9a9c5-0416-442d-9212-f9936a3b562c	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-24 17:40:41.532619+00	
00000000-0000-0000-0000-000000000000	cd144057-ef54-490c-9f4e-ad0883e41c0c	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-24 17:43:49.449301+00	
00000000-0000-0000-0000-000000000000	e98906fb-fff5-4599-83d2-155a31104ec7	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-24 17:44:33.65631+00	
00000000-0000-0000-0000-000000000000	3388593f-43c1-4af6-b3ce-be949fb28c0d	{"action":"token_refreshed","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-24 18:35:23.648868+00	
00000000-0000-0000-0000-000000000000	fe65b2e8-4598-478f-841d-f307f8811cec	{"action":"token_revoked","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-24 18:35:23.663578+00	
00000000-0000-0000-0000-000000000000	19286705-b6c0-4325-a71a-41f964a631ff	{"action":"logout","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-24 19:10:10.618116+00	
00000000-0000-0000-0000-000000000000	ac4349ee-8b63-4025-a3e4-821d76b16b05	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-24 19:10:16.841898+00	
00000000-0000-0000-0000-000000000000	035558bb-832d-4947-8d84-5997ce646889	{"action":"login","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-24 19:39:32.883879+00	
00000000-0000-0000-0000-000000000000	548f3439-5de1-48b3-a1a1-d806948e5f1c	{"action":"logout","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-24 19:43:12.423367+00	
00000000-0000-0000-0000-000000000000	6e945ac7-0720-4bb2-aea6-e700d0623afa	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-24 21:06:32.116385+00	
00000000-0000-0000-0000-000000000000	3b200b93-b6d0-4d5f-ab9e-e68d78b8a824	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-24 21:06:32.134005+00	
00000000-0000-0000-0000-000000000000	14bd10e9-b8a9-48fa-85f8-128b2ffa51cf	{"action":"logout","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-24 21:34:17.162262+00	
00000000-0000-0000-0000-000000000000	02eea85d-dcd2-4e99-8b62-3f54ab692132	{"action":"login","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-24 21:40:36.706158+00	
00000000-0000-0000-0000-000000000000	102adf6e-4aae-44b8-920c-7e872636edbe	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-25 12:00:10.61739+00	
00000000-0000-0000-0000-000000000000	b0e8c6f1-9ee5-4da1-8caf-22bf1d1b94a9	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-25 12:00:10.636927+00	
00000000-0000-0000-0000-000000000000	b568d032-e97c-402f-9d48-8a87904f8fd9	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-25 12:04:57.76582+00	
00000000-0000-0000-0000-000000000000	1f709343-d4b7-4695-81aa-23b39cc8513e	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-25 13:16:43.061164+00	
00000000-0000-0000-0000-000000000000	79ca699a-4405-487a-8ea6-dbd114f9d34b	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-25 13:22:09.566755+00	
00000000-0000-0000-0000-000000000000	6604bf1f-b11c-4b51-8758-c1cdf83d2813	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-25 13:22:09.573036+00	
00000000-0000-0000-0000-000000000000	dac70425-272e-4768-af72-23bfee83fba5	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-25 14:24:12.527549+00	
00000000-0000-0000-0000-000000000000	6e9e2717-f629-4aa8-87c3-470632ac6487	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-25 14:24:12.542991+00	
00000000-0000-0000-0000-000000000000	16fcc896-a6e6-4df5-8b33-248c1fabec62	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-25 14:40:28.359817+00	
00000000-0000-0000-0000-000000000000	9773c2cb-0f98-426c-a660-b26537267000	{"action":"logout","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-25 14:50:06.726955+00	
00000000-0000-0000-0000-000000000000	bff3e494-7489-4874-a88f-cbfbf42aa75d	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-25 15:02:43.243884+00	
00000000-0000-0000-0000-000000000000	42cb3f32-52f7-40cb-bbf5-8b0037b0c316	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-25 15:17:08.236848+00	
00000000-0000-0000-0000-000000000000	b057d543-ca84-4dbe-af1a-5beb0ef2560e	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-25 15:24:41.899004+00	
00000000-0000-0000-0000-000000000000	714006c4-7f2b-4434-8329-aecc469b4b14	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-25 15:24:41.906505+00	
00000000-0000-0000-0000-000000000000	ec0105b4-cd26-4d48-ab5f-3bf167fb8f3b	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-25 16:14:45.086085+00	
00000000-0000-0000-0000-000000000000	07bf75f1-db69-491f-a172-60d8f1a35a94	{"action":"token_refreshed","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-25 16:34:11.710862+00	
00000000-0000-0000-0000-000000000000	bd81a294-07c7-4668-b5fb-6290b9865362	{"action":"token_revoked","actor_id":"75ad6425-27e9-42cf-bb65-cd8d447fa0ad","actor_username":"mh.escritorio.hub@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-25 16:34:11.720651+00	
00000000-0000-0000-0000-000000000000	b6f5b4be-30ec-46ea-adfe-ba8712dfcc5a	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-25 17:26:04.707483+00	
00000000-0000-0000-0000-000000000000	d08c2ed2-8a88-4baf-86f3-95b2c565e2c9	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-25 20:03:19.480907+00	
00000000-0000-0000-0000-000000000000	e7ea8191-d716-4d9d-98d0-dbb16ab79ad3	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-25 20:03:19.493539+00	
00000000-0000-0000-0000-000000000000	66b9bab4-4012-47ae-8c8b-72439c08b685	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-25 20:05:26.253054+00	
00000000-0000-0000-0000-000000000000	a97525e2-dc50-4e16-a2ff-7b7214f3fa09	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-25 20:05:31.956056+00	
00000000-0000-0000-0000-000000000000	e59dd20c-4023-4f28-aa6b-746c676c1bfb	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-25 20:10:27.640612+00	
00000000-0000-0000-0000-000000000000	6c190f3b-8cf1-4d85-b53f-8416f67542ba	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-25 20:10:27.644554+00	
00000000-0000-0000-0000-000000000000	17a6e28a-0287-49fe-ab92-433425d8c92f	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-25 21:10:56.884945+00	
00000000-0000-0000-0000-000000000000	faddee62-a20d-4b7e-a498-697bd5939826	{"action":"logout","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-25 21:20:13.692998+00	
00000000-0000-0000-0000-000000000000	a40303ef-0eca-4dc9-a7dd-807abd879f6b	{"action":"token_refreshed","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-25 21:48:05.218389+00	
00000000-0000-0000-0000-000000000000	1b9788e0-0861-4376-be86-32e04b7c2063	{"action":"token_revoked","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-25 21:48:05.237901+00	
00000000-0000-0000-0000-000000000000	d5d83dcc-5437-4b71-ae85-82f0d351b44e	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-25 22:13:00.354552+00	
00000000-0000-0000-0000-000000000000	950ce8b9-1be0-4cc3-94c1-4eb69eb40017	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-25 22:13:00.370155+00	
00000000-0000-0000-0000-000000000000	c916042c-650b-417a-91f4-29f884cebccc	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-25 22:45:55.340411+00	
00000000-0000-0000-0000-000000000000	f5c9df56-2235-40ab-b53f-6a84af978590	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-25 22:45:55.347803+00	
00000000-0000-0000-0000-000000000000	df92ebe7-fc5c-4e21-a823-90bd05b093de	{"action":"logout","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account"}	2026-05-25 22:45:55.545329+00	
00000000-0000-0000-0000-000000000000	8c35947d-0a8d-4180-a51f-1c1c96ce74d3	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 02:09:02.754857+00	
00000000-0000-0000-0000-000000000000	08ee2976-ec93-4dcd-9363-68598f051cef	{"action":"logout","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-26 14:58:18.561177+00	
00000000-0000-0000-0000-000000000000	539c7279-9d8d-4f5d-856e-39734bc98d55	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 15:08:14.186069+00	
00000000-0000-0000-0000-000000000000	24b081d1-4f6a-4cb6-93f8-5f84631861d9	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 15:30:11.748836+00	
00000000-0000-0000-0000-000000000000	27d5722c-fc8b-4f00-a14e-68865fd933c6	{"action":"user_confirmation_requested","actor_id":"5a19dcc6-92fd-4ac7-a3e1-966b5c5bf9b3","actor_name":"teste","actor_username":"teste12@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-05-26 02:43:02.513675+00	
00000000-0000-0000-0000-000000000000	99bad698-92a8-4274-9333-cd0f45fe235e	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"teste12@gmail.com","user_id":"5a19dcc6-92fd-4ac7-a3e1-966b5c5bf9b3","user_phone":""}}	2026-05-26 02:45:06.925958+00	
00000000-0000-0000-0000-000000000000	2ef96e60-c647-4cc9-9979-cae400aa7bd8	{"action":"user_signedup","actor_id":"3bf3e188-c93c-4d7b-bc40-63d17af22acb","actor_name":"teste","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-05-26 02:46:31.050679+00	
00000000-0000-0000-0000-000000000000	5706a4e6-fb3c-40fd-8d91-e98e7a39d4ae	{"action":"login","actor_id":"3bf3e188-c93c-4d7b-bc40-63d17af22acb","actor_name":"teste","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 02:46:31.055259+00	
00000000-0000-0000-0000-000000000000	ef055b73-50d6-43e8-9d99-a07257e2b007	{"action":"login","actor_id":"3bf3e188-c93c-4d7b-bc40-63d17af22acb","actor_name":"teste","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 02:46:42.792076+00	
00000000-0000-0000-0000-000000000000	d51e0c4f-93e3-49bf-a3ff-285248b5a301	{"action":"logout","actor_id":"3bf3e188-c93c-4d7b-bc40-63d17af22acb","actor_name":"teste","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-26 02:50:10.53946+00	
00000000-0000-0000-0000-000000000000	781ed3fc-ca40-4834-be1b-4084864d7bf0	{"action":"user_repeated_signup","actor_id":"3bf3e188-c93c-4d7b-bc40-63d17af22acb","actor_name":"teste","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2026-05-26 02:50:17.869279+00	
00000000-0000-0000-0000-000000000000	bfb11cab-0fe3-4240-bd20-2d3e17c6d76d	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"teste@gmail.com","user_id":"3bf3e188-c93c-4d7b-bc40-63d17af22acb","user_phone":""}}	2026-05-26 02:50:33.849258+00	
00000000-0000-0000-0000-000000000000	9eab775b-9e52-44b8-bac6-22180efd938b	{"action":"user_signedup","actor_id":"9e04ae76-7bf0-46cc-909b-05770a38ebc8","actor_name":"teste","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-05-26 02:50:46.263198+00	
00000000-0000-0000-0000-000000000000	9675761c-af2a-49a9-84c5-aae1c4c3660a	{"action":"login","actor_id":"9e04ae76-7bf0-46cc-909b-05770a38ebc8","actor_name":"teste","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 02:50:46.267901+00	
00000000-0000-0000-0000-000000000000	4baff20d-d4f9-4b13-9f4b-026e5ddb9873	{"action":"login","actor_id":"9e04ae76-7bf0-46cc-909b-05770a38ebc8","actor_name":"teste","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 02:50:57.150346+00	
00000000-0000-0000-0000-000000000000	6a1de34b-c8f7-4396-880e-a6710f9dc952	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 02:52:55.692325+00	
00000000-0000-0000-0000-000000000000	431b65dd-59f4-4523-8bb0-875973b4f41b	{"action":"user_signedup","actor_id":"04bccc0d-afa4-4d80-bcc6-4d95f759749c","actor_name":"teste","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-05-26 02:53:35.382331+00	
00000000-0000-0000-0000-000000000000	6a01304a-b422-4b5b-8b5c-567fb428f5d9	{"action":"login","actor_id":"04bccc0d-afa4-4d80-bcc6-4d95f759749c","actor_name":"teste","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 02:53:35.386554+00	
00000000-0000-0000-0000-000000000000	3dec1ca3-8ace-407c-8d26-1531eee232de	{"action":"login","actor_id":"04bccc0d-afa4-4d80-bcc6-4d95f759749c","actor_name":"teste","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 02:53:41.402939+00	
00000000-0000-0000-0000-000000000000	1d6353ab-7bd7-415d-9214-c17052706c92	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 02:54:05.781214+00	
00000000-0000-0000-0000-000000000000	55b96492-1a12-41c4-a900-996f25d609b0	{"action":"user_signedup","actor_id":"29a2ebd4-0421-4428-9ef5-fb580f681d85","actor_name":"teste@gmail.com","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-05-26 02:54:22.962485+00	
00000000-0000-0000-0000-000000000000	062c9240-1176-4327-b931-75f29fffd026	{"action":"login","actor_id":"29a2ebd4-0421-4428-9ef5-fb580f681d85","actor_name":"teste@gmail.com","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 02:54:22.97435+00	
00000000-0000-0000-0000-000000000000	1411416e-9c0c-40c5-a5ed-0fb32af407f0	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 02:54:58.749864+00	
00000000-0000-0000-0000-000000000000	05e14d94-c152-4216-98a3-9bf3a15727a0	{"action":"user_signedup","actor_id":"4714ef83-81fa-424d-8280-c6d45285b387","actor_name":"teste@gmai.com","actor_username":"teste@gmai.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-05-26 02:57:00.244899+00	
00000000-0000-0000-0000-000000000000	c1b7a92c-d8bd-4e74-ad03-e634e29a5e50	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 17:36:18.477364+00	
00000000-0000-0000-0000-000000000000	5ba13759-9025-45d9-9cbb-7b8a237644b3	{"action":"login","actor_id":"4714ef83-81fa-424d-8280-c6d45285b387","actor_name":"teste@gmai.com","actor_username":"teste@gmai.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 02:57:00.258374+00	
00000000-0000-0000-0000-000000000000	ee36040b-6b34-49ee-8bf9-23c186f2aa54	{"action":"user_signedup","actor_id":"713fd1f8-ba02-49f7-9e0e-f8717e543350","actor_name":"teste@gmail.com","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-05-26 02:59:45.375984+00	
00000000-0000-0000-0000-000000000000	80905e31-edc0-4e25-87b0-3b97bbb75b90	{"action":"login","actor_id":"713fd1f8-ba02-49f7-9e0e-f8717e543350","actor_name":"teste@gmail.com","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 02:59:45.381015+00	
00000000-0000-0000-0000-000000000000	7d064d52-b6a0-4845-9cce-eb19018eec1f	{"action":"login","actor_id":"713fd1f8-ba02-49f7-9e0e-f8717e543350","actor_name":"teste@gmail.com","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 02:59:53.916842+00	
00000000-0000-0000-0000-000000000000	c34ddc54-2a78-458d-97cb-2077d38b90f9	{"action":"logout","actor_id":"713fd1f8-ba02-49f7-9e0e-f8717e543350","actor_name":"teste@gmail.com","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-26 02:59:58.601938+00	
00000000-0000-0000-0000-000000000000	bed8d6a1-efaf-4e96-b6f3-fadf283c5f94	{"action":"login","actor_id":"713fd1f8-ba02-49f7-9e0e-f8717e543350","actor_name":"teste@gmail.com","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 03:00:38.29369+00	
00000000-0000-0000-0000-000000000000	5f016bb5-cc9d-4251-9c9d-3b6919d20972	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 03:53:11.006429+00	
00000000-0000-0000-0000-000000000000	0f1855ab-d3ed-4632-a501-3dc1bfddb8b7	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 03:53:11.025523+00	
00000000-0000-0000-0000-000000000000	6fe43036-ff70-4192-847c-d2a8f4bc6f7f	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 04:00:51.909739+00	
00000000-0000-0000-0000-000000000000	32bea604-c5f8-4e17-87d4-c7e4764183c6	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 04:00:51.915294+00	
00000000-0000-0000-0000-000000000000	7fcb8ed9-1fa9-4758-8c88-8a80075264f0	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 11:28:01.901333+00	
00000000-0000-0000-0000-000000000000	0a40966a-a73d-478e-8e74-0774ba9e173e	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 11:28:01.924711+00	
00000000-0000-0000-0000-000000000000	a33fc289-47ab-411e-a500-9cfb16e2b455	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 11:29:10.236705+00	
00000000-0000-0000-0000-000000000000	43d8f046-2fdd-4a1f-b568-65dade03614d	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 11:29:10.237301+00	
00000000-0000-0000-0000-000000000000	96633a46-3588-4e41-8ea6-f59161cf9e6c	{"action":"user_signedup","actor_id":"1a52bdb8-e714-4d25-90d4-d1f9ff1c01eb","actor_name":"joao","actor_username":"joao@gmai.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-05-26 11:40:16.596646+00	
00000000-0000-0000-0000-000000000000	ad348e37-f8f1-45dc-b503-588bc5051ed0	{"action":"login","actor_id":"1a52bdb8-e714-4d25-90d4-d1f9ff1c01eb","actor_name":"joao","actor_username":"joao@gmai.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 11:40:16.613502+00	
00000000-0000-0000-0000-000000000000	d90e9f08-6420-404b-919a-899a2a8c8786	{"action":"user_signedup","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-05-26 11:51:00.629423+00	
00000000-0000-0000-0000-000000000000	6234ecff-ae3c-4085-b098-01e5413f38ed	{"action":"login","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 11:51:00.639413+00	
00000000-0000-0000-0000-000000000000	61b4aed9-ca88-41d6-80db-9cd425da373b	{"action":"login","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 11:58:46.436429+00	
00000000-0000-0000-0000-000000000000	6d44744f-6507-4c7e-9186-9b87efe57f53	{"action":"logout","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-26 12:00:16.065625+00	
00000000-0000-0000-0000-000000000000	7e0c2ef4-3943-4175-8d98-2766c995a258	{"action":"login","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 12:00:21.10363+00	
00000000-0000-0000-0000-000000000000	99b598f6-7cf2-4ee5-bc2a-dbd5e429ccf4	{"action":"login","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 12:00:35.154749+00	
00000000-0000-0000-0000-000000000000	78eab1e2-a306-494f-b3bd-afda2502c084	{"action":"logout","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-26 12:00:35.308697+00	
00000000-0000-0000-0000-000000000000	81e56629-8803-4b2d-8b9c-b7b20f843068	{"action":"login","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 12:00:53.630022+00	
00000000-0000-0000-0000-000000000000	738986fc-70b3-4abc-9ecd-feef17b05141	{"action":"logout","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-26 12:01:26.264783+00	
00000000-0000-0000-0000-000000000000	e7ae3bfe-5724-4705-843a-2320b27ce8b6	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 12:03:56.727001+00	
00000000-0000-0000-0000-000000000000	4797a513-243f-4136-9f2d-3a89aed57a4d	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 12:21:05.012915+00	
00000000-0000-0000-0000-000000000000	48122143-9996-4a40-8bf8-43e5ba69860b	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 12:26:57.406089+00	
00000000-0000-0000-0000-000000000000	ffef6fed-d64f-48c8-ae02-9d9407cb5859	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 12:26:57.414275+00	
00000000-0000-0000-0000-000000000000	5662095c-dd3f-42fb-a122-bd9dac394841	{"action":"login","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 13:08:04.877692+00	
00000000-0000-0000-0000-000000000000	9b1b8f4e-d004-4c2e-94b7-6fb5fbbe3491	{"action":"user_signedup","actor_id":"2afcd5cc-f17f-4e1e-b9c5-b7225ca3f830","actor_name":"test","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-05-26 13:09:00.858843+00	
00000000-0000-0000-0000-000000000000	75ffe5de-e0e0-433b-8afd-0089167003f6	{"action":"login","actor_id":"2afcd5cc-f17f-4e1e-b9c5-b7225ca3f830","actor_name":"test","actor_username":"teste@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 13:09:00.869943+00	
00000000-0000-0000-0000-000000000000	3cb5abec-5c64-4956-a0e7-3c6b49a5a672	{"action":"user_signedup","actor_id":"3bf71e1a-4058-4928-ab37-8d96f95f0f3f","actor_name":"teste2","actor_username":"teste2@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-05-26 13:09:22.917477+00	
00000000-0000-0000-0000-000000000000	3e41aa32-61c2-4dbf-a261-df456078f32a	{"action":"login","actor_id":"3bf71e1a-4058-4928-ab37-8d96f95f0f3f","actor_name":"teste2","actor_username":"teste2@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 13:09:22.92049+00	
00000000-0000-0000-0000-000000000000	e9f0c063-5f2f-45e0-9926-037061ce5e39	{"action":"logout","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-26 13:22:43.301132+00	
00000000-0000-0000-0000-000000000000	c7e986e9-e352-42ae-9423-b48fbc8cfe0d	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 13:25:27.829781+00	
00000000-0000-0000-0000-000000000000	a4cac333-ee18-4324-be31-fa4aa46f25d3	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 13:25:27.84277+00	
00000000-0000-0000-0000-000000000000	45309c0d-b758-4344-95e1-6ccea470dbd6	{"action":"token_refreshed","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 13:56:21.881209+00	
00000000-0000-0000-0000-000000000000	ac5eebcf-f681-4299-bea5-ec4842cee096	{"action":"token_revoked","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 13:56:21.902517+00	
00000000-0000-0000-0000-000000000000	3ce01212-3f96-4b84-8f66-cadd006e84a2	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 14:10:44.487207+00	
00000000-0000-0000-0000-000000000000	7828ab82-67d6-477e-9cfe-394b21fa0f77	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 14:10:44.492118+00	
00000000-0000-0000-0000-000000000000	0498d66c-2573-4c2a-8d18-4cf213e5ed7a	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 14:51:50.941069+00	
00000000-0000-0000-0000-000000000000	ca75da7b-423f-4757-a192-a4f6e7d43e9e	{"action":"token_refreshed","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 15:02:19.65061+00	
00000000-0000-0000-0000-000000000000	c3855ae6-3d6f-45a1-8ea0-6075d0100a5d	{"action":"token_revoked","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 15:02:19.657225+00	
00000000-0000-0000-0000-000000000000	a0e92ff3-c32e-4c84-bf05-864e4e79a405	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 15:28:46.144993+00	
00000000-0000-0000-0000-000000000000	38fb1ca7-e89d-4948-98d8-8936598b7519	{"action":"token_refreshed","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 17:28:24.860323+00	
00000000-0000-0000-0000-000000000000	ca190dfe-25c4-47ea-9671-d5ebd93ead71	{"action":"token_revoked","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 17:28:24.889486+00	
00000000-0000-0000-0000-000000000000	59428ebc-77ee-4367-ba35-ba12bcd2686c	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 17:36:18.500738+00	
00000000-0000-0000-0000-000000000000	dc07db7c-4dd6-4d81-85a2-af2074014f71	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 21:13:02.79409+00	
00000000-0000-0000-0000-000000000000	ea47eca9-931c-4a0c-8967-f79b36369aed	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 21:13:02.819679+00	
00000000-0000-0000-0000-000000000000	20577476-0bdb-4e4c-857d-1457f0abd2cf	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 21:44:29.333714+00	
00000000-0000-0000-0000-000000000000	379c01ee-e8e8-4b9c-8aa1-c2a26d6c3947	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 21:46:26.284647+00	
00000000-0000-0000-0000-000000000000	f199f4f7-2437-49f5-b1be-4f805ebf36b1	{"action":"logout","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-26 21:49:41.861411+00	
00000000-0000-0000-0000-000000000000	5530f293-f558-44f9-97af-12e92e63994e	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 22:04:33.240838+00	
00000000-0000-0000-0000-000000000000	d919c82f-0d21-485a-b58e-42fcf5a6c619	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 22:06:25.491849+00	
00000000-0000-0000-0000-000000000000	d4cfa519-da58-49ce-bd4e-494185079cbe	{"action":"login","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 22:06:49.775358+00	
00000000-0000-0000-0000-000000000000	3d49de37-1173-4312-aa4b-be4bfe0b94d3	{"action":"logout","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-26 22:09:03.193645+00	
00000000-0000-0000-0000-000000000000	3709d0ea-e9b4-407c-8a6d-d329cb1dba62	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 22:21:58.598678+00	
00000000-0000-0000-0000-000000000000	eb6d592f-1999-479b-97f9-efa3d5e9a2cc	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 23:37:03.138997+00	
00000000-0000-0000-0000-000000000000	341dd261-80c7-4e47-ac69-cdc38efc057f	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-26 23:37:03.161721+00	
00000000-0000-0000-0000-000000000000	fc76b075-3d08-4c44-9ea0-9bb8c509007d	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-26 23:37:15.449408+00	
00000000-0000-0000-0000-000000000000	48eebe94-b64a-4954-9235-d9a94db9314e	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 01:23:06.685668+00	
00000000-0000-0000-0000-000000000000	f3f0cf32-c559-4ff2-9cfd-d3c5d4c29324	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 01:23:06.710426+00	
00000000-0000-0000-0000-000000000000	209f1833-a2e1-42fb-84b4-0f780fd9b9e9	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 02:12:43.156655+00	
00000000-0000-0000-0000-000000000000	331bae7d-90e1-4064-951a-b7d545fe2704	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 02:12:43.176589+00	
00000000-0000-0000-0000-000000000000	f8afd1e0-c3d2-47fb-9422-2e064a5623d5	{"action":"login","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 02:57:05.173265+00	
00000000-0000-0000-0000-000000000000	5c0fbeb6-5f6a-4268-bf50-9f7d0e51527b	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 03:11:08.033122+00	
00000000-0000-0000-0000-000000000000	8da9f404-43c9-4070-b2d1-4ebccc764f3e	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 03:11:08.046877+00	
00000000-0000-0000-0000-000000000000	42756b47-7ace-4e03-a895-1af1f3471fd6	{"action":"logout","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-27 03:27:34.242774+00	
00000000-0000-0000-0000-000000000000	d89c9c51-f69c-4f36-9125-8279ff224632	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 03:27:44.259399+00	
00000000-0000-0000-0000-000000000000	27e7c3b4-d76f-42e4-af42-d1317863c37f	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 03:27:44.261338+00	
00000000-0000-0000-0000-000000000000	d0e581a1-d7c1-4ce5-ac98-bfffdc95ca8b	{"action":"token_refreshed","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 12:10:25.297575+00	
00000000-0000-0000-0000-000000000000	37dfd7df-d2bf-42b1-b9a2-29ae5b0ca63a	{"action":"token_revoked","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 12:10:25.323872+00	
00000000-0000-0000-0000-000000000000	c5cedb48-f148-422e-800e-0a74aada7151	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 12:13:42.714915+00	
00000000-0000-0000-0000-000000000000	f883f7d8-7653-4bbb-a032-8870804cc075	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 12:13:47.80463+00	
00000000-0000-0000-0000-000000000000	560fa25e-c6d6-4d3b-972a-7d0551dde5be	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 12:31:27.058694+00	
00000000-0000-0000-0000-000000000000	a9c535f6-c877-4e85-bff6-e87a12776bea	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 12:31:27.075276+00	
00000000-0000-0000-0000-000000000000	ec48510c-fbed-49a9-a233-ebede05fdb14	{"action":"token_refreshed","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 13:08:45.06252+00	
00000000-0000-0000-0000-000000000000	3baf3205-778d-43e1-bf21-893210637bac	{"action":"token_revoked","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 13:08:45.083807+00	
00000000-0000-0000-0000-000000000000	1189def1-64e5-4641-8ae2-2b0225c9f79b	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 13:10:24.759189+00	
00000000-0000-0000-0000-000000000000	22b11084-422a-441b-a4df-ef6a664f50f4	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 13:10:24.76295+00	
00000000-0000-0000-0000-000000000000	e3b45e8e-743f-43ee-b683-a77d9d95496f	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 13:37:26.202394+00	
00000000-0000-0000-0000-000000000000	d2ebd326-3a4c-46d7-a7e8-10e8abb256c7	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 13:37:26.226591+00	
00000000-0000-0000-0000-000000000000	0c774639-a5e0-4352-bf0e-4f8e8caec261	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 13:48:46.15684+00	
00000000-0000-0000-0000-000000000000	a19d3864-5630-41bd-9ec0-a73e523a2776	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 14:11:45.027704+00	
00000000-0000-0000-0000-000000000000	2c50e4a2-7998-42b0-ae6c-aa65496dcbc3	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 14:11:45.054438+00	
00000000-0000-0000-0000-000000000000	58795aec-ee8c-46b9-869e-f79307b60dad	{"action":"token_refreshed","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 14:23:54.180851+00	
00000000-0000-0000-0000-000000000000	3c9fe777-e81c-431e-a2c8-7302458ebff1	{"action":"token_revoked","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 14:23:54.196406+00	
00000000-0000-0000-0000-000000000000	28f4411b-828f-4251-a2c5-6184b76fe790	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 14:50:26.742485+00	
00000000-0000-0000-0000-000000000000	258eeca5-df14-42af-890a-ed642ab896f4	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 14:50:39.762651+00	
00000000-0000-0000-0000-000000000000	93ac79bc-2bca-47be-80ea-415c1b23d5bf	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 14:51:51.662415+00	
00000000-0000-0000-0000-000000000000	a150a6a0-eaa6-4cc4-aca9-9410462059e3	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 14:51:51.667471+00	
00000000-0000-0000-0000-000000000000	8566656b-5820-4074-9322-89f8be9dce5e	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-27 14:51:51.765641+00	
00000000-0000-0000-0000-000000000000	66804f5c-6e97-4ae0-8576-416c7e863a05	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 14:58:41.452134+00	
00000000-0000-0000-0000-000000000000	8191a4d9-5cb1-49ee-8390-db45d7fcfadd	{"action":"login","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 15:01:58.32783+00	
00000000-0000-0000-0000-000000000000	0b1a6cee-4195-499f-b92a-46572b8fba55	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 15:03:46.522009+00	
00000000-0000-0000-0000-000000000000	14a592ba-66ae-420d-88b4-bd8f0865236e	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 15:16:06.50729+00	
00000000-0000-0000-0000-000000000000	a9a2d296-d960-4bc9-bbed-46be0b084160	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 15:16:21.120769+00	
00000000-0000-0000-0000-000000000000	0a41db58-7f6c-44b8-bd62-3d73734fdf9d	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 15:17:34.446926+00	
00000000-0000-0000-0000-000000000000	f9e504b2-e9e1-42b3-8a90-7d7d1b075c45	{"action":"logout","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-27 15:56:58.419972+00	
00000000-0000-0000-0000-000000000000	d3fce47f-ea6f-4148-93f1-3a48bb8a6f47	{"action":"token_refreshed","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 16:03:25.326016+00	
00000000-0000-0000-0000-000000000000	e736b92d-4b2f-4767-81b1-b8231fbfffcd	{"action":"token_revoked","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 16:03:25.330684+00	
00000000-0000-0000-0000-000000000000	5e746649-5d12-49e8-83b8-72df750bb863	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 16:55:50.134462+00	
00000000-0000-0000-0000-000000000000	93f340c0-e970-402d-b723-c64023733bee	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 16:56:20.543072+00	
00000000-0000-0000-0000-000000000000	7bc0fee1-4a41-4783-9901-04257127269a	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-27 17:08:21.39265+00	
00000000-0000-0000-0000-000000000000	68531be1-2cdb-4448-a89a-7d8e09f77244	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-27 17:08:21.413021+00	
00000000-0000-0000-0000-000000000000	23fefe91-d039-4d06-a9f3-77e3b57acfd6	{"action":"logout","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account"}	2026-05-27 17:08:21.773138+00	
00000000-0000-0000-0000-000000000000	4f4da38b-637d-489f-a105-a173811f3aa0	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 17:13:38.855629+00	
00000000-0000-0000-0000-000000000000	f3ad89b6-98a2-42cf-806e-28801d88cf26	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 17:20:15.028394+00	
00000000-0000-0000-0000-000000000000	5aef9b77-c407-4546-9901-7446dfa3bdb3	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 17:27:13.852474+00	
00000000-0000-0000-0000-000000000000	9878762e-d4a3-4fcd-93d0-1ee78dc54e9e	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 17:33:40.662996+00	
00000000-0000-0000-0000-000000000000	f2e27b04-db33-432f-9967-2e056e61f880	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 17:46:12.96154+00	
00000000-0000-0000-0000-000000000000	e97a7f5d-804d-4320-97c8-c46b03ce4dd7	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 18:12:46.505227+00	
00000000-0000-0000-0000-000000000000	f18cd5a3-5d81-4634-a153-e5e1b105e33e	{"action":"login","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 19:13:19.412973+00	
00000000-0000-0000-0000-000000000000	aa93c782-81c9-43ec-98b5-c5e7f7ee322d	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 19:22:38.339213+00	
00000000-0000-0000-0000-000000000000	09d554ff-d97a-4317-9d6c-1ed07e6eaeeb	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 19:22:40.756825+00	
00000000-0000-0000-0000-000000000000	98a14c53-f6ba-403b-9baa-6b5cdeb3130b	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 19:33:42.236572+00	
00000000-0000-0000-0000-000000000000	5d8ee324-51e6-4611-bd68-e1960f643b4e	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 19:33:42.250204+00	
00000000-0000-0000-0000-000000000000	1e205da9-f22e-4ad1-af94-6b1aaaa5e3fc	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 19:33:45.044127+00	
00000000-0000-0000-0000-000000000000	1c5f5f1d-4511-4278-9da5-9ca71b6f9d70	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 19:35:14.478061+00	
00000000-0000-0000-0000-000000000000	b45ba38a-6256-4631-9d80-b906e80adcb5	{"action":"token_refreshed","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 20:29:51.927529+00	
00000000-0000-0000-0000-000000000000	589532fb-e7d5-44db-89e6-678af2c0bc38	{"action":"token_revoked","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 20:29:51.944408+00	
00000000-0000-0000-0000-000000000000	f3f8d49a-d0ab-4225-a2c9-36c2ce752d9b	{"action":"logout","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-27 20:35:18.670755+00	
00000000-0000-0000-0000-000000000000	94379445-bdb2-407b-b16f-4211c84335ee	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 21:38:02.224756+00	
00000000-0000-0000-0000-000000000000	25ed26f7-9c32-4205-9c5f-c0d57feeabb8	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-27 21:38:02.239292+00	
00000000-0000-0000-0000-000000000000	20b96406-7bae-4e77-bf12-6e3bd47c3fd2	{"action":"login","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-27 21:57:11.316742+00	
00000000-0000-0000-0000-000000000000	e0d1206e-d54e-4af6-94b7-b40fc75da131	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 11:35:27.065935+00	
00000000-0000-0000-0000-000000000000	83e0a8c2-c629-4b96-b8f8-607435509a8b	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 11:42:13.887394+00	
00000000-0000-0000-0000-000000000000	22aeea04-ab72-4631-967f-d2923255f2e5	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 11:42:13.895367+00	
00000000-0000-0000-0000-000000000000	ec3cbec8-1bf4-4fba-b9e0-7720a4b7825a	{"action":"login","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 11:54:14.897201+00	
00000000-0000-0000-0000-000000000000	f622b2da-d623-4c1b-9bf9-24893e8d2e15	{"action":"logout","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-28 12:06:31.604629+00	
00000000-0000-0000-0000-000000000000	1c42d4a3-602f-45b2-94cb-4636ab34744f	{"action":"token_refreshed","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 12:12:15.126558+00	
00000000-0000-0000-0000-000000000000	4781318e-9e5a-4816-af28-1a4b9d63170c	{"action":"token_revoked","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 12:12:15.148958+00	
00000000-0000-0000-0000-000000000000	2929835e-36d8-4191-ac9e-47fe83874bb2	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 12:13:00.456648+00	
00000000-0000-0000-0000-000000000000	0688551a-2a74-4bc1-9923-e0fd0d7a96b8	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 12:13:15.289283+00	
00000000-0000-0000-0000-000000000000	b1931913-e00d-468c-a8ec-bc5336d074d5	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-28 12:53:52.237971+00	
00000000-0000-0000-0000-000000000000	a1042e96-d8e7-4ca5-ab8c-793a9d81b418	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-28 12:53:52.26331+00	
00000000-0000-0000-0000-000000000000	76047a20-0ba5-483b-a707-4d3fa45c34f4	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-28 12:54:36.891253+00	
00000000-0000-0000-0000-000000000000	7a48f873-9035-48ee-b27c-913c2f2d0364	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-28 12:54:36.892026+00	
00000000-0000-0000-0000-000000000000	ce1f9da8-44f2-4d40-8161-8b21df0b3d31	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 12:56:21.92025+00	
00000000-0000-0000-0000-000000000000	b222f8ff-79a5-4933-8035-33681e3271bc	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 12:56:21.927111+00	
00000000-0000-0000-0000-000000000000	33183992-44c8-4377-a694-50473797f2de	{"action":"login","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 12:58:02.562938+00	
00000000-0000-0000-0000-000000000000	eeb4cc1b-749f-40b7-ad9c-5f9f5576ddbe	{"action":"logout","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-28 12:58:02.723676+00	
00000000-0000-0000-0000-000000000000	21cb1142-2ec3-4ca4-8f9b-600b6e808234	{"action":"login","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 13:00:19.523108+00	
00000000-0000-0000-0000-000000000000	81e13a29-de65-4a21-90e6-24ff4a1e5afe	{"action":"logout","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-28 13:00:19.610162+00	
00000000-0000-0000-0000-000000000000	1390dcef-8eac-4b38-aa62-e009a3cbab25	{"action":"login","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 13:00:58.341996+00	
00000000-0000-0000-0000-000000000000	842d94a9-345e-428d-b30d-50331fd1bf95	{"action":"logout","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-28 13:06:11.255922+00	
00000000-0000-0000-0000-000000000000	06060626-3be7-40e2-b449-a5e6838863ab	{"action":"login","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 13:28:32.096586+00	
00000000-0000-0000-0000-000000000000	4868e0ee-4803-40f5-a884-0a96eadd11ef	{"action":"logout","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-28 13:28:32.329058+00	
00000000-0000-0000-0000-000000000000	903a9ae6-004a-4e3e-a1fb-c3a61d0e7f02	{"action":"token_refreshed","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 13:31:51.166499+00	
00000000-0000-0000-0000-000000000000	d4ff651f-896d-40c0-ac27-70f464a8fcf8	{"action":"token_revoked","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 13:31:51.169383+00	
00000000-0000-0000-0000-000000000000	44cc32d0-1917-4a90-a43f-0d97ba04898b	{"action":"token_refreshed","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 13:31:51.371817+00	
00000000-0000-0000-0000-000000000000	a792a1e2-5cb5-4885-b02e-7d092f34bba5	{"action":"token_revoked","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 13:31:51.372632+00	
00000000-0000-0000-0000-000000000000	522cbd57-1d94-4919-9a10-7f80c0416e06	{"action":"token_refreshed","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 13:40:14.188688+00	
00000000-0000-0000-0000-000000000000	37a41acb-64f9-41d0-bbe8-8e6fff38a45e	{"action":"token_revoked","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 13:40:14.195076+00	
00000000-0000-0000-0000-000000000000	6c48daf0-f8be-4e24-8924-5779239eb1d8	{"action":"logout","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-28 14:12:26.191745+00	
00000000-0000-0000-0000-000000000000	437cc565-3b0a-4c8a-a9a7-9c2d5b80e654	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 14:13:23.803075+00	
00000000-0000-0000-0000-000000000000	6b51d372-e5db-440b-9638-4c813f80f8d2	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 14:40:46.952092+00	
00000000-0000-0000-0000-000000000000	7259bbb9-1c28-432a-8bb9-595840eaa80b	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 14:42:06.798752+00	
00000000-0000-0000-0000-000000000000	3cfdacd1-81a2-4bc0-95fd-504b162d361a	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 14:43:01.706879+00	
00000000-0000-0000-0000-000000000000	cb258024-2799-477c-b8bf-c9b251a788ef	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-28 14:44:18.528499+00	
00000000-0000-0000-0000-000000000000	2ab777f1-4d4d-4ea2-b720-59f52d4620de	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-28 14:44:18.548385+00	
00000000-0000-0000-0000-000000000000	38e7517d-de59-4cf7-a9c6-0aa674a732d1	{"action":"logout","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-28 14:49:37.858295+00	
00000000-0000-0000-0000-000000000000	6c22b909-5044-42b3-b440-b7169ec2ea3f	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 15:16:56.834645+00	
00000000-0000-0000-0000-000000000000	00ec0e89-9922-40d9-8626-5f867745ad9c	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-28 16:00:13.89691+00	
00000000-0000-0000-0000-000000000000	222b818f-95ff-4ca4-8402-6f77d6f34728	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-28 16:00:13.922596+00	
00000000-0000-0000-0000-000000000000	b7ae2520-eef8-4401-827e-af6903e79248	{"action":"token_refreshed","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 16:08:05.025152+00	
00000000-0000-0000-0000-000000000000	0ecc8529-d57b-45f7-9fb7-a929f57a155c	{"action":"token_revoked","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 16:08:05.030542+00	
00000000-0000-0000-0000-000000000000	cbcc08d6-fd77-491b-bb02-d551b8092a35	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 16:08:40.11791+00	
00000000-0000-0000-0000-000000000000	6e385ff8-2b48-4742-9dfb-58ffa96d03ce	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 16:08:40.118981+00	
00000000-0000-0000-0000-000000000000	a4a16ea6-64d2-4616-8a59-ae823b418acc	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 16:18:02.442138+00	
00000000-0000-0000-0000-000000000000	1b3c9194-6987-4cca-b27f-12b5c381da05	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 16:18:24.839685+00	
00000000-0000-0000-0000-000000000000	2e3d21fc-2dfd-4600-af3c-94a0e8fa5cca	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 16:45:53.689593+00	
00000000-0000-0000-0000-000000000000	e5844481-d75f-4815-b57b-23340250c754	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 16:48:19.649422+00	
00000000-0000-0000-0000-000000000000	0b563462-66a9-41b2-9fa2-7e85e41832f6	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 16:49:39.82254+00	
00000000-0000-0000-0000-000000000000	b19f8d17-55be-4ae2-889c-3076e0efedec	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 16:51:01.575696+00	
00000000-0000-0000-0000-000000000000	2e2e97ee-ff86-43b6-8884-1251614755ea	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-28 17:00:27.725088+00	
00000000-0000-0000-0000-000000000000	586ba28d-d993-4a2a-8f46-47d1870be481	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 17:04:14.909503+00	
00000000-0000-0000-0000-000000000000	12143d95-8ef8-43c4-9826-4a441fd4702c	{"action":"logout","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-28 17:12:39.223933+00	
00000000-0000-0000-0000-000000000000	5879fed9-0197-45c6-be3c-e42e1e0de53a	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-28 17:26:02.97447+00	
00000000-0000-0000-0000-000000000000	50253e5f-25a2-4d26-bd82-96ce123efa4e	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-28 17:26:02.979421+00	
00000000-0000-0000-0000-000000000000	df229e19-1d58-47fa-b09b-d37d6787831a	{"action":"token_refreshed","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 17:27:17.616847+00	
00000000-0000-0000-0000-000000000000	77b4b202-2ef7-41c1-bb72-3a1e704f074f	{"action":"token_revoked","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 17:27:17.618211+00	
00000000-0000-0000-0000-000000000000	67a053e3-f418-4eaa-b5ff-1793a8c39a8b	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-28 17:27:19.393175+00	
00000000-0000-0000-0000-000000000000	532336d1-9a15-4049-8ea4-b0ef740a7fbc	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-28 17:27:19.393868+00	
00000000-0000-0000-0000-000000000000	1f7b62b3-9f5b-4230-9e41-259e431a451f	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 17:32:27.58703+00	
00000000-0000-0000-0000-000000000000	7ae836e1-c616-4c5d-870a-8dd85d1f9c7e	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 17:39:15.025355+00	
00000000-0000-0000-0000-000000000000	3c0cb89f-ad43-4d34-8efe-d8eddd8f504e	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 17:44:21.95615+00	
00000000-0000-0000-0000-000000000000	bcf2eed5-2eeb-4ff2-9c04-cd7a1186194c	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 17:44:21.980763+00	
00000000-0000-0000-0000-000000000000	cb89156f-a7e9-4563-aa5a-b375c1b16fe5	{"action":"logout","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-28 17:44:22.266018+00	
00000000-0000-0000-0000-000000000000	af7bf615-6355-4522-8776-56823aaab0cc	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 17:49:17.830135+00	
00000000-0000-0000-0000-000000000000	68b380a8-67cb-41e6-8689-dc5d13b97d33	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 17:49:17.834355+00	
00000000-0000-0000-0000-000000000000	dd0ec62d-11d6-4fdf-9f84-d6e33734ed2b	{"action":"logout","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account"}	2026-05-28 18:16:48.903723+00	
00000000-0000-0000-0000-000000000000	ac3c04b3-3108-42f8-b54f-b371d0f5e692	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 19:26:10.669496+00	
00000000-0000-0000-0000-000000000000	0b355a41-2701-44e1-a2bb-dacc161db536	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 19:26:10.692916+00	
00000000-0000-0000-0000-000000000000	40a8dee0-f001-471d-a653-98b54ae75c26	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 19:51:44.173237+00	
00000000-0000-0000-0000-000000000000	50a8bcb6-86d4-4409-80a2-4738430919b7	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 19:51:44.197345+00	
00000000-0000-0000-0000-000000000000	e6ecb5dd-6732-4be2-9559-9415fd117ee1	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 20:03:05.261203+00	
00000000-0000-0000-0000-000000000000	b1439cfe-0635-4ec8-84b5-b13c5de242d2	{"action":"logout","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-28 20:04:04.788532+00	
00000000-0000-0000-0000-000000000000	63d28bce-fd18-42ef-8f85-184daa1713a3	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 20:07:54.909071+00	
00000000-0000-0000-0000-000000000000	7b44287e-8185-477c-9576-e73c9bc03ae9	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 20:07:54.913519+00	
00000000-0000-0000-0000-000000000000	86800036-3328-412d-a827-49a351c5bd90	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 20:09:29.269813+00	
00000000-0000-0000-0000-000000000000	d6a81373-494a-4c87-8522-8a31ce9a43aa	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-28 20:09:29.270805+00	
00000000-0000-0000-0000-000000000000	e0658f34-2697-4f6e-8f45-0f47d399e46b	{"action":"login","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 20:10:55.618168+00	
00000000-0000-0000-0000-000000000000	b75a27d5-bbef-429c-8db6-9897ebd45a0d	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-28 20:12:57.895682+00	
00000000-0000-0000-0000-000000000000	8525864e-1677-4204-972c-b4c8912f0635	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 20:14:25.695999+00	
00000000-0000-0000-0000-000000000000	d45ec97d-4aaf-4f8f-94dc-3d448c3f0bc8	{"action":"logout","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-28 20:43:35.746075+00	
00000000-0000-0000-0000-000000000000	3040ac85-b906-42e8-bc33-f2f8107f423c	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-28 21:29:35.033537+00	
00000000-0000-0000-0000-000000000000	ffabdf99-894f-4a09-a8a8-a24251d07129	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 01:06:20.78936+00	
00000000-0000-0000-0000-000000000000	5d8e839d-2d73-4eb4-b9d9-c048f2e98fae	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-29 02:04:36.957782+00	
00000000-0000-0000-0000-000000000000	c0293013-c696-46d1-8011-b5f65c3e727e	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-29 02:04:36.98153+00	
00000000-0000-0000-0000-000000000000	e078d2f3-02bf-4ed7-9934-d4c31744331c	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 11:24:11.522289+00	
00000000-0000-0000-0000-000000000000	a83ac1db-5933-4e60-a77c-0de3ebf4e946	{"action":"token_refreshed","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-29 12:11:31.551929+00	
00000000-0000-0000-0000-000000000000	4c9246a3-64cc-4788-bf07-33f419690f3f	{"action":"token_revoked","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-29 12:11:31.570801+00	
00000000-0000-0000-0000-000000000000	a49c84c7-ae1c-4bcd-ad43-ff6b860bcbc3	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 12:18:59.807517+00	
00000000-0000-0000-0000-000000000000	4df1fc88-ab8e-4c28-ba96-74f54111e4de	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 12:19:28.296278+00	
00000000-0000-0000-0000-000000000000	abc2de45-1e92-4e2d-b58b-f37de992e5a4	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 13:18:04.221618+00	
00000000-0000-0000-0000-000000000000	a63dbd63-eda6-4b30-b958-c7327167a0e7	{"action":"token_refreshed","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-29 13:20:58.030803+00	
00000000-0000-0000-0000-000000000000	4c78561b-6d4c-4ab5-825d-31ae4f426d2c	{"action":"token_revoked","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-29 13:20:58.036344+00	
00000000-0000-0000-0000-000000000000	e2642f8a-b9f0-42b2-950e-ad28166f8b5c	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 13:51:56.600597+00	
00000000-0000-0000-0000-000000000000	0fd00231-0255-4b65-aaf3-5be83e614ddc	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 13:51:58.538561+00	
00000000-0000-0000-0000-000000000000	5a0aeddf-c67e-4b4a-af22-d179c48333bb	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 13:54:52.241706+00	
00000000-0000-0000-0000-000000000000	7beebabf-ac03-4639-a5ab-4d12bbb5ed22	{"action":"logout","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-29 14:03:20.744256+00	
00000000-0000-0000-0000-000000000000	7a725feb-8d84-45b1-9c94-3fafb7b14559	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 14:03:26.435924+00	
00000000-0000-0000-0000-000000000000	f5285fcc-617a-47a0-8d60-8e918ae98601	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-29 14:08:31.222097+00	
00000000-0000-0000-0000-000000000000	719b7674-3806-43a6-8515-8b9258127c9e	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 14:08:50.421731+00	
00000000-0000-0000-0000-000000000000	f9b915c1-9daa-4a3b-8daf-3baf7edfd3ab	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 14:17:37.155902+00	
00000000-0000-0000-0000-000000000000	c7c6b8cf-2225-4ccd-ac45-427fe72ff21f	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 14:23:27.633776+00	
00000000-0000-0000-0000-000000000000	cf74402e-c0ba-4f74-8be1-6c9d63264a3c	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 14:26:46.752769+00	
00000000-0000-0000-0000-000000000000	d3a71fff-8aeb-416b-ae0c-433f4504a371	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 14:55:29.205845+00	
00000000-0000-0000-0000-000000000000	e80ad0a2-c9c5-409f-8a3b-7ad5f708a7b2	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 15:04:38.108731+00	
00000000-0000-0000-0000-000000000000	68b58fae-ab0d-4c88-8946-be8b130a8e96	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 15:12:38.97388+00	
00000000-0000-0000-0000-000000000000	ce04e166-d970-46e7-8f90-3ad9c608d953	{"action":"login","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 15:18:31.305626+00	
00000000-0000-0000-0000-000000000000	8a2eb39a-4683-4a8f-b9b3-726f77aad8ed	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-29 15:44:08.22614+00	
00000000-0000-0000-0000-000000000000	719dd4e4-0a49-4ec4-9934-9c8c0ac1af19	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-29 15:44:08.245608+00	
00000000-0000-0000-0000-000000000000	9abee2d1-e878-4bab-b8bd-a4696d732af2	{"action":"login","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 15:55:10.067434+00	
00000000-0000-0000-0000-000000000000	ea596286-5995-41b8-adbf-1cae46843a71	{"action":"token_refreshed","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-29 16:00:37.820638+00	
00000000-0000-0000-0000-000000000000	93c0e378-e9b6-43b5-b89b-78382d61be81	{"action":"token_revoked","actor_id":"1d621888-613a-4a15-b796-3c4120f51af2","actor_username":"mh.escritoriocarmella@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-29 16:00:37.824813+00	
00000000-0000-0000-0000-000000000000	437cf101-14c7-4074-95d0-82cac15a86c1	{"action":"token_refreshed","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-29 16:09:35.413324+00	
00000000-0000-0000-0000-000000000000	12645cc2-f67f-450c-b5df-1dae5b75763a	{"action":"token_revoked","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-29 16:09:35.420009+00	
00000000-0000-0000-0000-000000000000	61acc890-2703-4bc1-a30c-47c303852ee7	{"action":"logout","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-29 16:24:43.962584+00	
00000000-0000-0000-0000-000000000000	e67ac9e5-98a9-48f8-90cb-23b00a4b9d9e	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-29 17:10:05.537481+00	
00000000-0000-0000-0000-000000000000	8808bf67-6fe0-4409-84ba-2f2a6d0425c6	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-29 17:10:05.556012+00	
00000000-0000-0000-0000-000000000000	d5c3071d-e2af-43d3-b9fe-fa3be694f757	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-29 17:31:09.372844+00	
00000000-0000-0000-0000-000000000000	58519818-e680-4fa5-ad99-917c680970f9	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-29 17:31:09.379586+00	
00000000-0000-0000-0000-000000000000	adf1af77-1332-4499-ab8f-1aa89c90c65f	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 17:44:13.741476+00	
00000000-0000-0000-0000-000000000000	2f23a40b-e26a-4236-a9d2-1c79b1236980	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-29 19:09:44.107353+00	
00000000-0000-0000-0000-000000000000	bb8e31fe-0d76-4f64-982f-327e3fa58ca3	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-29 19:09:44.133343+00	
00000000-0000-0000-0000-000000000000	e3d9fb3a-5c99-43ab-9ee4-c2968dfd4751	{"action":"logout","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account"}	2026-05-29 19:09:44.269081+00	
00000000-0000-0000-0000-000000000000	f2082e5e-eccb-4e79-b5d6-c7f51f1da0dc	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 19:09:47.745288+00	
00000000-0000-0000-0000-000000000000	7bdbd43d-9813-4af1-9939-c4a772b99027	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-29 19:09:52.340841+00	
00000000-0000-0000-0000-000000000000	c3127bdb-fe27-4498-8147-7c67725360f0	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-29 19:32:31.801031+00	
00000000-0000-0000-0000-000000000000	1dcea047-6f38-4136-9e15-9f2e721aaf92	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-29 19:32:31.812664+00	
00000000-0000-0000-0000-000000000000	7ef66446-4e92-4a63-bc7d-0f1dc0c4a300	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-29 20:33:42.013442+00	
00000000-0000-0000-0000-000000000000	4c908ffc-a6ac-40ab-94c2-45a62040ec46	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-29 20:33:42.029247+00	
00000000-0000-0000-0000-000000000000	54ea8f82-be44-46b2-829a-4f6d644f048a	{"action":"token_refreshed","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-29 20:45:16.463818+00	
00000000-0000-0000-0000-000000000000	8d9747b7-dce4-4d1c-a259-a38fdba033d5	{"action":"token_revoked","actor_id":"16ddd940-9f73-4313-ba08-9ee96735181c","actor_username":"amandacorte053@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-29 20:45:16.48465+00	
00000000-0000-0000-0000-000000000000	43a9e589-9e4b-45e9-a0fa-553e5d1d60b9	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-30 00:57:30.157156+00	
00000000-0000-0000-0000-000000000000	abdf1ce5-ce71-4d9e-9538-bea2158128f5	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 02:05:49.474566+00	
00000000-0000-0000-0000-000000000000	de017619-4551-475a-a96d-8f2a8909c8b6	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 02:05:49.502551+00	
00000000-0000-0000-0000-000000000000	43046381-5b77-4493-bc4c-b44ac16fac72	{"action":"login","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-30 02:51:50.587409+00	
00000000-0000-0000-0000-000000000000	8350f2fd-8135-4daa-9009-3ba9dc40f4b8	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-30 03:01:21.218176+00	
00000000-0000-0000-0000-000000000000	5a1ffae4-ad41-4d44-8c05-be8564ab90a4	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 03:04:37.872804+00	
00000000-0000-0000-0000-000000000000	b6796c1a-4ac7-492e-b787-9196453d1ffb	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 03:04:37.882244+00	
00000000-0000-0000-0000-000000000000	c2f632a4-3834-4f1b-b2b7-f74e8aa0be75	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-30 04:54:39.74114+00	
00000000-0000-0000-0000-000000000000	1b61387c-736a-461c-9de4-7b7173d4c9cd	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-30 04:54:39.769051+00	
00000000-0000-0000-0000-000000000000	6b663846-a9db-40ae-88e6-0d886c4458b1	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 10:57:18.35478+00	
00000000-0000-0000-0000-000000000000	49ee9c29-a384-4509-901b-c43dc32f1613	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 10:57:18.380305+00	
00000000-0000-0000-0000-000000000000	0385d5fd-b817-4e9f-a922-b75e5dc61c1c	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 11:55:28.763592+00	
00000000-0000-0000-0000-000000000000	dab8b3c0-1849-4eda-a17b-df409fa69a76	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 11:55:28.783183+00	
00000000-0000-0000-0000-000000000000	09e558d3-db1a-4e18-a787-263369cd510f	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 13:19:54.719139+00	
00000000-0000-0000-0000-000000000000	b6321f82-5515-4865-a1e9-d5a21614b33c	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 13:19:54.742367+00	
00000000-0000-0000-0000-000000000000	ac1c7acc-b031-4666-8d64-4c5b97e2c182	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 14:18:19.107314+00	
00000000-0000-0000-0000-000000000000	47262950-545f-4736-8693-3d1461788150	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 14:18:19.119929+00	
00000000-0000-0000-0000-000000000000	e2bedd6f-4a76-4e77-9133-d9452ac79cc1	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-30 14:48:57.90705+00	
00000000-0000-0000-0000-000000000000	ea04969e-216f-4845-b78c-38b2e5a8065d	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 15:18:18.268501+00	
00000000-0000-0000-0000-000000000000	741f7b5f-32c7-4dc3-8ea1-964fd0d43806	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 15:18:18.291799+00	
00000000-0000-0000-0000-000000000000	cd9bd0bd-3ecb-425d-aaaf-2ba76ed20044	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 15:22:38.204326+00	
00000000-0000-0000-0000-000000000000	562082ba-cdb2-40b6-b4b2-352267b9cf14	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 15:22:38.209021+00	
00000000-0000-0000-0000-000000000000	a4121b9b-76cb-46d2-bdfc-483498269d02	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-30 16:10:49.667631+00	
00000000-0000-0000-0000-000000000000	95ae0923-aea8-4dce-8203-4f6f97dedd3d	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-30 16:13:15.900831+00	
00000000-0000-0000-0000-000000000000	526c49b7-5d83-4a42-a046-baa78cfafe99	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 16:16:32.549646+00	
00000000-0000-0000-0000-000000000000	a043376c-6b00-4891-9052-e05babb7b762	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 16:16:32.563684+00	
00000000-0000-0000-0000-000000000000	04cc52b0-8e0f-4841-97cb-9921fd524328	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-30 16:20:15.147005+00	
00000000-0000-0000-0000-000000000000	7aef671e-0f54-4610-a6cf-e2656341a041	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 17:19:30.262439+00	
00000000-0000-0000-0000-000000000000	a1f180d9-81a8-4a91-8fde-76cc9f5bf4e0	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 17:19:30.282872+00	
00000000-0000-0000-0000-000000000000	6ab3df5e-a8ca-4082-b899-3e4f413f4002	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-30 17:28:50.778508+00	
00000000-0000-0000-0000-000000000000	639fd795-0002-404d-b8f9-f333d8f13923	{"action":"login","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-30 17:30:29.277009+00	
00000000-0000-0000-0000-000000000000	bc81d7e8-3caa-4dd3-a0d6-74e4212ed367	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 17:58:24.869505+00	
00000000-0000-0000-0000-000000000000	69703434-06d1-464a-a5f8-5335dc404353	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 17:58:24.890227+00	
00000000-0000-0000-0000-000000000000	5e1abf86-6474-40d6-8716-62f31e57314e	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-30 18:09:46.701381+00	
00000000-0000-0000-0000-000000000000	b9d5fd1c-b37b-4ea1-a817-a550c344b2a4	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-30 18:09:46.710395+00	
00000000-0000-0000-0000-000000000000	14a4d65d-ce14-487e-aa7d-5a1282f198a9	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-30 18:09:57.268934+00	
00000000-0000-0000-0000-000000000000	480a853f-5aeb-453a-a0df-211988cb7d23	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-30 18:09:57.271656+00	
00000000-0000-0000-0000-000000000000	03a60d3f-e061-443c-8b1c-ce0533953ea3	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 18:33:57.855852+00	
00000000-0000-0000-0000-000000000000	b4622c02-b45a-4832-82d1-601b97638b9c	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 18:33:57.871643+00	
00000000-0000-0000-0000-000000000000	6ee86c80-2784-41c8-8393-296301e6328d	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-30 18:50:28.605672+00	
00000000-0000-0000-0000-000000000000	2f9a77f2-d1ce-4ca4-9299-73596e1d4894	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-30 18:54:42.791694+00	
00000000-0000-0000-0000-000000000000	0a9d22a5-9b53-4708-b9ee-7384d70bfe06	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-30 18:54:42.833345+00	
00000000-0000-0000-0000-000000000000	085040ad-caa6-4e49-bf16-e9883142d56d	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 18:56:32.86058+00	
00000000-0000-0000-0000-000000000000	4d27f55c-c43e-4158-a3ff-b22d2c4b3100	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 18:56:32.862795+00	
00000000-0000-0000-0000-000000000000	8a94ffa7-db9e-4ccf-a061-8fb784e59bce	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-30 19:21:17.155286+00	
00000000-0000-0000-0000-000000000000	e40a1599-e47f-48be-a6a9-9b0e0f6a8b35	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-30 19:22:02.917441+00	
00000000-0000-0000-0000-000000000000	8a16c114-fa68-4b3c-a573-f5d43098600e	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 19:53:03.619755+00	
00000000-0000-0000-0000-000000000000	b91f827b-4ae4-4353-8c6d-1bf1a42167bf	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 19:53:03.632021+00	
00000000-0000-0000-0000-000000000000	3f2b7a50-9644-405b-b156-91a07405b479	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 19:54:57.764104+00	
00000000-0000-0000-0000-000000000000	9166cadc-34ae-4137-9239-44befe0565fa	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 19:54:57.779898+00	
00000000-0000-0000-0000-000000000000	06b17d1c-5c96-49bf-a593-1831fdd793fc	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 20:08:15.463864+00	
00000000-0000-0000-0000-000000000000	32f6a81c-2cc2-40ff-902c-38bcb6454af7	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 20:08:15.475653+00	
00000000-0000-0000-0000-000000000000	5604a12c-27a2-4805-a8a6-74b72e60f470	{"action":"login","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-30 20:24:19.164338+00	
00000000-0000-0000-0000-000000000000	6187df1f-86db-4b56-a3c8-1eead2002df5	{"action":"logout","actor_id":"c24dd627-7a1e-407e-9fe0-eefe4d5320c7","actor_username":"endrywgabrielx@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-30 20:34:13.551837+00	
00000000-0000-0000-0000-000000000000	2a78f910-bae0-48f0-a04c-c041709ad2f2	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-30 20:34:20.382476+00	
00000000-0000-0000-0000-000000000000	da4cb94b-a7aa-494c-b4c9-87f98bb58ff9	{"action":"logout","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-30 20:39:38.6515+00	
00000000-0000-0000-0000-000000000000	c3c2c7a5-ff6b-4a4f-9961-ca0f01871e70	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 20:46:43.27487+00	
00000000-0000-0000-0000-000000000000	977cb924-5d11-4e26-a485-31b94b9c464b	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-30 20:46:43.287509+00	
00000000-0000-0000-0000-000000000000	1fd8bba2-3f30-4f2a-98d6-725f1643834a	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-30 20:51:34.540009+00	
00000000-0000-0000-0000-000000000000	6abc88e1-ca88-46be-b236-b3c15e680251	{"action":"logout","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-30 20:58:21.906778+00	
00000000-0000-0000-0000-000000000000	ae525f36-ed73-4a07-a326-104957067e80	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-30 21:48:28.958442+00	
00000000-0000-0000-0000-000000000000	b57ff71d-ca3c-4d43-b8c8-d695202fd937	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-30 21:50:21.272274+00	
00000000-0000-0000-0000-000000000000	45d93534-3b13-4c49-a2d9-e18b4ee09a2a	{"action":"logout","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-30 21:55:29.61029+00	
00000000-0000-0000-0000-000000000000	2817b79c-2ee9-48c3-8a32-56a2b81f88ad	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 00:50:34.020867+00	
00000000-0000-0000-0000-000000000000	1cd514a9-1a1f-41a1-b10b-3f38bf314120	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 00:50:34.044369+00	
00000000-0000-0000-0000-000000000000	a6f84e83-a41a-4355-914d-e5bebe02b333	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 12:35:40.444739+00	
00000000-0000-0000-0000-000000000000	983e2dfc-5a2a-455d-b4d3-36fb426f9f24	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 12:35:40.470629+00	
00000000-0000-0000-0000-000000000000	5acec0ae-1f2d-49b9-a0e0-dfd17bd1d5ce	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 13:34:21.573607+00	
00000000-0000-0000-0000-000000000000	35afc052-295c-46c1-aca0-57fc574ddb78	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 13:34:21.583866+00	
00000000-0000-0000-0000-000000000000	0512bf49-d25c-4e92-8650-3d5e2cce3819	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 14:32:29.303897+00	
00000000-0000-0000-0000-000000000000	5a3eaa35-3055-441f-ab00-00452f32dc43	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 14:32:29.315374+00	
00000000-0000-0000-0000-000000000000	4f6557fa-afbc-45f4-8824-c7f22cb4c163	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-31 15:30:13.41016+00	
00000000-0000-0000-0000-000000000000	781bd6ac-9ee5-4670-b357-e547feba5f07	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 15:33:26.443396+00	
00000000-0000-0000-0000-000000000000	3f4339ef-2e12-4c4c-9a88-fd5a0300eda4	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 15:33:26.462483+00	
00000000-0000-0000-0000-000000000000	8a2c3f50-9279-49c3-9b67-0232ae10537d	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-31 15:33:33.231804+00	
00000000-0000-0000-0000-000000000000	d5068e58-8a1b-4cfc-9997-a52b1e492afd	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 15:41:37.069254+00	
00000000-0000-0000-0000-000000000000	0d33c94b-8e0f-4044-9e62-d241d44b9c03	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 15:41:37.077592+00	
00000000-0000-0000-0000-000000000000	c167823c-26f7-40dd-897f-92a20800d324	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-31 15:43:43.837798+00	
00000000-0000-0000-0000-000000000000	26fc8c17-4322-484b-a214-d9963020f4c0	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-31 15:48:52.4381+00	
00000000-0000-0000-0000-000000000000	2d6968b5-32b2-41db-9275-9f8e78594c48	{"action":"logout","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-31 15:54:42.776816+00	
00000000-0000-0000-0000-000000000000	ebbd1a0b-bc1d-4a0a-9e54-4a83701d1c91	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-31 16:23:08.35383+00	
00000000-0000-0000-0000-000000000000	0d8bc817-7737-4183-9145-74d68363371c	{"action":"login","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-31 16:24:32.474158+00	
00000000-0000-0000-0000-000000000000	7013c2d9-7d31-4f0c-b736-a891eecb68f9	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 16:33:09.225588+00	
00000000-0000-0000-0000-000000000000	052699f1-34c6-4656-a31a-1824f7ec6665	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 16:33:09.241552+00	
00000000-0000-0000-0000-000000000000	139a9217-8ae0-4423-903a-f565ffe703d9	{"action":"login","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-31 17:39:15.765001+00	
00000000-0000-0000-0000-000000000000	52c467a4-449a-4d04-9a81-acfd103a7135	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 17:53:37.007805+00	
00000000-0000-0000-0000-000000000000	2bc787a4-2f33-4d0c-b78b-ef3cae6f3da3	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 17:53:37.018042+00	
00000000-0000-0000-0000-000000000000	e4bed101-743d-4277-800a-ba3f38368e11	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-31 17:54:08.432311+00	
00000000-0000-0000-0000-000000000000	871d19ce-05de-4381-89f1-b02750fc3c76	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 18:02:07.300737+00	
00000000-0000-0000-0000-000000000000	3e2e3ae9-2b4d-4f0b-86ee-58a4396d2317	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 18:02:07.325558+00	
00000000-0000-0000-0000-000000000000	32c0c3c8-a3e3-4b0f-9b9e-a6bb746f62a1	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 18:03:20.428539+00	
00000000-0000-0000-0000-000000000000	a3b761d4-441a-424c-9be0-1d932e0c48a0	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 18:03:20.429937+00	
00000000-0000-0000-0000-000000000000	bb90f3f4-5676-43ce-8905-92089a7f324f	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 19:02:04.847807+00	
00000000-0000-0000-0000-000000000000	215a75d3-053c-462f-a793-c3ddbe34f3e7	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 19:02:04.868585+00	
00000000-0000-0000-0000-000000000000	7f228716-16e7-4137-a86d-04e11ae9038d	{"action":"token_refreshed","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 19:20:28.343694+00	
00000000-0000-0000-0000-000000000000	f4a38b83-97a0-44e4-b132-01d6c8540751	{"action":"token_revoked","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 19:20:28.372836+00	
00000000-0000-0000-0000-000000000000	fef3912b-f8d6-4411-a84a-e854a050d0d8	{"action":"logout","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-31 19:24:15.811673+00	
00000000-0000-0000-0000-000000000000	6c73b928-0ec7-496b-a3ad-ea38a55d3c9a	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-31 19:24:29.172493+00	
00000000-0000-0000-0000-000000000000	02305d41-0412-47d8-a21d-c3a2eb9064f6	{"action":"logout","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-31 19:25:41.20596+00	
00000000-0000-0000-0000-000000000000	b08f30d5-001c-4fac-bc7b-d9f25bcea2e9	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-31 19:36:13.06736+00	
00000000-0000-0000-0000-000000000000	df6113b2-4580-4e46-a724-cfef58c2758e	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-31 20:08:27.10831+00	
00000000-0000-0000-0000-000000000000	061d7da9-a681-4a43-b6cc-1c07b57b08c8	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-31 20:09:39.738841+00	
00000000-0000-0000-0000-000000000000	bbc0d322-2885-42d4-8795-7021d17c7d9a	{"action":"login","actor_id":"054e1fc1-7d77-4ae0-addb-13e440f53d6b","actor_username":"cassiafernanda344@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-31 20:43:34.560942+00	
00000000-0000-0000-0000-000000000000	ab5dcdca-d12b-4a3a-800f-74eaa7592d80	{"action":"login","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-31 21:08:58.351599+00	
00000000-0000-0000-0000-000000000000	334bd776-a325-4f4c-8263-15164febab97	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 21:10:03.274345+00	
00000000-0000-0000-0000-000000000000	3405b647-1b0b-43f8-8a40-37f26e517331	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 21:10:03.277572+00	
00000000-0000-0000-0000-000000000000	212ede77-3387-48ca-b369-10a9abba6031	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-05-31 21:35:00.774047+00	
00000000-0000-0000-0000-000000000000	a4f31ad0-4a08-473f-9e58-9b0b7209174e	{"action":"token_refreshed","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 22:01:47.008675+00	
00000000-0000-0000-0000-000000000000	b8fb5136-f393-45da-9422-0629bddf337e	{"action":"token_revoked","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 22:01:47.030219+00	
00000000-0000-0000-0000-000000000000	f546912e-3982-4c90-a73d-b37b7775b5c7	{"action":"logout","actor_id":"3e43c2e5-3604-48ad-807a-bfa38ebdbfff","actor_username":"sthefani.alves.def@gmail.com","actor_via_sso":false,"log_type":"account"}	2026-05-31 22:08:24.268632+00	
00000000-0000-0000-0000-000000000000	f2fdce54-f78c-46f0-881d-4fb1010a5977	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 22:08:26.373805+00	
00000000-0000-0000-0000-000000000000	b42f2629-91c5-4334-bec5-6eaf58d8b06c	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 22:08:26.375273+00	
00000000-0000-0000-0000-000000000000	1f37e847-320e-43a1-8814-70ec567e65e5	{"action":"token_refreshed","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 22:11:36.308848+00	
00000000-0000-0000-0000-000000000000	e40f6935-0d09-4233-a425-dcf99573af71	{"action":"token_revoked","actor_id":"cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3","actor_name":"joao","actor_username":"joao@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-05-31 22:11:36.314088+00	
00000000-0000-0000-0000-000000000000	cbbb50ee-be7b-4d79-8b08-d4823169a1ff	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-31 22:19:16.758909+00	
00000000-0000-0000-0000-000000000000	2af1e2d2-8bcf-433e-af1e-afbc384971b5	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-05-31 22:19:16.767312+00	
00000000-0000-0000-0000-000000000000	6bc0be68-71c6-4020-a325-14eb156e0715	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-06-01 00:35:46.808338+00	
00000000-0000-0000-0000-000000000000	eb6e6492-7eb6-4185-8b42-48c52eec4fe0	{"action":"login","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-06-01 00:49:35.638481+00	
00000000-0000-0000-0000-000000000000	4f5be75d-7938-443d-a0f5-2b403e6e5885	{"action":"user_signedup","actor_id":"b5668aed-dbb4-4d19-918e-c4e62e308487","actor_name":"Loja Ahu","actor_username":"mh.loja.ahu@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-06-01 00:51:42.794371+00	
00000000-0000-0000-0000-000000000000	d9763332-0033-4620-90ed-e5145c82b7d1	{"action":"login","actor_id":"b5668aed-dbb4-4d19-918e-c4e62e308487","actor_name":"Loja Ahu","actor_username":"mh.loja.ahu@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-06-01 00:51:42.805906+00	
00000000-0000-0000-0000-000000000000	ced9319d-5881-4716-91c6-a479cceb10e8	{"action":"user_signedup","actor_id":"d68a59d3-2331-4ada-a377-60659501c047","actor_name":"Loja Alto XV","actor_username":"mh.loja.altoxv@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2026-06-01 00:52:00.109732+00	
00000000-0000-0000-0000-000000000000	b5a44f40-988f-4537-9fbb-7715774df7e9	{"action":"login","actor_id":"d68a59d3-2331-4ada-a377-60659501c047","actor_name":"Loja Alto XV","actor_username":"mh.loja.altoxv@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-06-01 00:52:00.118252+00	
00000000-0000-0000-0000-000000000000	79434e35-8023-4889-b45f-5989320dff41	{"action":"login","actor_id":"b5668aed-dbb4-4d19-918e-c4e62e308487","actor_name":"Loja Ahu","actor_username":"mh.loja.ahu@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2026-06-01 01:06:12.566072+00	
00000000-0000-0000-0000-000000000000	54df64e4-d701-448c-b6be-6aa76f6777fb	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-06-01 01:35:19.71108+00	
00000000-0000-0000-0000-000000000000	81a42fc9-6c5c-4645-b6e5-e1bf2c96998b	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-06-01 01:35:19.732845+00	
00000000-0000-0000-0000-000000000000	ed003f45-c709-4842-8c70-1efb6307ce05	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-06-01 01:48:29.448618+00	
00000000-0000-0000-0000-000000000000	3cb36b89-0dfe-4176-9104-8d48dc362f22	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-06-01 01:48:29.463785+00	
00000000-0000-0000-0000-000000000000	8e2e62ad-5c17-4c2a-830e-eabbd6bbfbf7	{"action":"token_refreshed","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-06-01 02:01:54.041692+00	
00000000-0000-0000-0000-000000000000	77c0bfe8-e916-461c-b913-26c56a522f70	{"action":"token_revoked","actor_id":"d956fdab-0d1c-463c-9cfc-63f42d3645a5","actor_username":"marina_nocera@yahoo.com.br","actor_via_sso":false,"log_type":"token"}	2026-06-01 02:01:54.05841+00	
00000000-0000-0000-0000-000000000000	9ea8ebac-76ed-4690-86fe-07d2e2393cb0	{"action":"token_refreshed","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-06-01 02:36:44.229381+00	
00000000-0000-0000-0000-000000000000	8f6f895c-e505-4011-9e58-ca7b2fedc5dc	{"action":"token_revoked","actor_id":"35cae5eb-f980-4be0-9998-ac8173ed2afc","actor_username":"henocera@gmail.com","actor_via_sso":false,"log_type":"token"}	2026-06-01 02:36:44.238137+00	
\.


--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."custom_oauth_providers" ("id", "provider_type", "identifier", "name", "client_id", "client_secret", "acceptable_client_ids", "scopes", "pkce_enabled", "attribute_mapping", "authorization_params", "enabled", "email_optional", "issuer", "discovery_url", "skip_nonce_check", "cached_discovery", "discovery_cached_at", "authorization_url", "token_url", "userinfo_url", "jwks_uri", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at", "invite_token", "referrer", "oauth_client_state_id", "linking_target_id", "email_optional") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
00000000-0000-0000-0000-000000000000	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	authenticated	authenticated	endrywgabrielx@gmail.com	$2a$10$qTV0MYuL7bFe2yuWmXZZxONBzI2QN1o1MXPBIUNoPE3kQo2Ptk/ea	2026-03-09 14:28:18.45909+00	\N		\N		\N			\N	2026-05-30 20:24:19.187596+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-03-09 14:28:18.45085+00	2026-05-30 20:24:19.261374+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	054e1fc1-7d77-4ae0-addb-13e440f53d6b	authenticated	authenticated	cassiafernanda344@gmail.com	$2a$10$sNM/k2lnM5z86Gzs3BcAqeQks9XvQfVXmfyxna4EnX53JU1FaJFti	2026-03-09 14:25:48.917968+00	\N		\N		\N			\N	2026-05-31 20:43:34.588203+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-03-09 14:25:48.914495+00	2026-05-31 20:43:34.67134+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	d956fdab-0d1c-463c-9cfc-63f42d3645a5	authenticated	authenticated	marina_nocera@yahoo.com.br	$2a$10$cVtT.MzkAieOYwWH8WzNw.h5whgnSThkeB9qTHH08dVcoXMwNF5nW	2026-02-26 18:29:52.887042+00	\N		\N		\N			\N	2026-05-31 16:24:32.478112+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-02-26 18:29:52.862737+00	2026-06-01 02:01:54.086101+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	d68a59d3-2331-4ada-a377-60659501c047	authenticated	authenticated	mh.loja.altoxv@gmail.com	$2a$06$w0wSRvnIF9CKQLotC8Y2NOreCl/cX9nXs1cKVIbs6zxs2x5LPobjK	2026-06-01 00:52:00.1153+00	\N		\N		\N			\N	2026-06-01 00:52:00.12067+00	{"provider": "email", "providers": ["email"]}	{"sub": "d68a59d3-2331-4ada-a377-60659501c047", "email": "mh.loja.altoxv@gmail.com", "full_name": "Loja Alto XV", "email_verified": true, "phone_verified": false}	\N	2026-06-01 00:52:00.101036+00	2026-06-01 00:52:09.286263+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	b5668aed-dbb4-4d19-918e-c4e62e308487	authenticated	authenticated	mh.loja.ahu@gmail.com	$2a$06$r8wksoL4x8M6cbjz.2oDeO/UBBnDN3LF3GM2yESW98vpDUPP9D1Em	2026-06-01 00:51:42.797067+00	\N		\N		\N			\N	2026-06-01 01:06:12.588446+00	{"provider": "email", "providers": ["email"]}	{"sub": "b5668aed-dbb4-4d19-918e-c4e62e308487", "email": "mh.loja.ahu@gmail.com", "full_name": "Loja Ahu", "email_verified": true, "phone_verified": false}	\N	2026-06-01 00:51:42.715596+00	2026-06-01 01:06:12.638753+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	35cae5eb-f980-4be0-9998-ac8173ed2afc	authenticated	authenticated	henocera@gmail.com	$2a$10$K4uc/W0Rgsu9KDKHs3lbEueaX4Y6AO0Uv9EmRp4gMpVIxzyKf4zTW	2026-02-16 17:12:12.866708+00	\N		\N		\N			\N	2026-06-01 00:49:35.656047+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-02-16 17:12:12.854688+00	2026-06-01 02:36:44.254582+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	authenticated	authenticated	sthefani.alves.def@gmail.com	$2a$10$DoOD5ASwp.wuun38yWnFuuR9OAvluqQcdZMRvRnZQYkAo8ERHp0xW	2026-02-26 18:22:13.361012+00	\N		\N		\N			\N	2026-05-31 17:39:15.785021+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-02-26 18:22:13.334517+00	2026-05-31 22:01:47.067941+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	16ddd940-9f73-4313-ba08-9ee96735181c	authenticated	authenticated	amandacorte053@gmail.com	$2a$10$DiZUEAb7ePIxIhUn/I/hv.guB8rywVnsr2EiQH3sX529igqPsDIli	2026-04-27 17:21:12.002925+00	\N		\N		\N			\N	2026-05-29 15:55:10.085137+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-04-27 17:21:11.949358+00	2026-05-29 20:45:16.515467+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3	authenticated	authenticated	joao@gmail.com	$2a$06$ni20LAG2TXKgiZe5Yg4bmO8WBWQYxiQhVMRBv6eHji30xzYHRLBOG	2026-05-26 11:51:00.634764+00	\N		\N		\N			\N	2026-05-31 21:08:58.368002+00	{"provider": "email", "providers": ["email"]}	{"sub": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "email": "joao@gmail.com", "full_name": "joao", "email_verified": true, "phone_verified": false}	\N	2026-05-26 11:51:00.572536+00	2026-05-31 22:11:36.321053+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	1d621888-613a-4a15-b796-3c4120f51af2	authenticated	authenticated	mh.escritoriocarmella@gmail.com	$2a$10$1o604cOGIPZ6poFC/u7AXu6EhjJXmBAnSsgJijzF9NXidFMwESXSm	2026-04-29 15:56:53.664651+00	\N		\N		\N			\N	2026-05-29 15:18:31.31935+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2026-04-29 15:56:53.64283+00	2026-05-29 16:00:37.829738+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
35cae5eb-f980-4be0-9998-ac8173ed2afc	35cae5eb-f980-4be0-9998-ac8173ed2afc	{"sub": "35cae5eb-f980-4be0-9998-ac8173ed2afc", "email": "henocera@gmail.com", "email_verified": false, "phone_verified": false}	email	2026-02-16 17:12:12.861526+00	2026-02-16 17:12:12.861579+00	2026-02-16 17:12:12.861579+00	ddd0b0ea-147f-42e1-a5b5-67d883333bd3
3e43c2e5-3604-48ad-807a-bfa38ebdbfff	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	{"sub": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff", "email": "sthefani.alves.def@gmail.com", "email_verified": false, "phone_verified": false}	email	2026-02-26 18:22:13.35423+00	2026-02-26 18:22:13.354285+00	2026-02-26 18:22:13.354285+00	34b680eb-c5f5-4879-8571-9506ce98eb77
d956fdab-0d1c-463c-9cfc-63f42d3645a5	d956fdab-0d1c-463c-9cfc-63f42d3645a5	{"sub": "d956fdab-0d1c-463c-9cfc-63f42d3645a5", "email": "marina_nocera@yahoo.com.br", "email_verified": false, "phone_verified": false}	email	2026-02-26 18:29:52.878689+00	2026-02-26 18:29:52.878767+00	2026-02-26 18:29:52.878767+00	f4c6ab60-4b9f-4975-99a9-9af139ec5e0d
054e1fc1-7d77-4ae0-addb-13e440f53d6b	054e1fc1-7d77-4ae0-addb-13e440f53d6b	{"sub": "054e1fc1-7d77-4ae0-addb-13e440f53d6b", "email": "cassiafernanda344@gmail.com", "email_verified": false, "phone_verified": false}	email	2026-03-09 14:25:48.916149+00	2026-03-09 14:25:48.916195+00	2026-03-09 14:25:48.916195+00	c1b09ab5-1020-44ae-a14c-5a538350aa18
c24dd627-7a1e-407e-9fe0-eefe4d5320c7	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	{"sub": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "email": "endrywgabrielx@gmail.com", "email_verified": false, "phone_verified": false}	email	2026-03-09 14:28:18.454215+00	2026-03-09 14:28:18.454263+00	2026-03-09 14:28:18.454263+00	85e3a5ee-f4c6-4355-81e7-17b29e856567
16ddd940-9f73-4313-ba08-9ee96735181c	16ddd940-9f73-4313-ba08-9ee96735181c	{"sub": "16ddd940-9f73-4313-ba08-9ee96735181c", "email": "amandacorte053@gmail.com", "email_verified": false, "phone_verified": false}	email	2026-04-27 17:21:11.970465+00	2026-04-27 17:21:11.970525+00	2026-04-27 17:21:11.970525+00	e1ef7aba-670e-4032-ba7d-cb0511eab67e
1d621888-613a-4a15-b796-3c4120f51af2	1d621888-613a-4a15-b796-3c4120f51af2	{"sub": "1d621888-613a-4a15-b796-3c4120f51af2", "email": "mh.escritoriocarmella@gmail.com", "email_verified": false, "phone_verified": false}	email	2026-04-29 15:56:53.652724+00	2026-04-29 15:56:53.652785+00	2026-04-29 15:56:53.652785+00	c78d0019-6f71-4fa9-9fce-784e67e51e58
cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3	cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3	{"sub": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "email": "joao@gmail.com", "full_name": "joao", "email_verified": false, "phone_verified": false}	email	2026-05-26 11:51:00.624937+00	2026-05-26 11:51:00.624995+00	2026-05-26 11:51:00.624995+00	8f53eca0-45a8-4a6b-8522-51b37a77a7c3
b5668aed-dbb4-4d19-918e-c4e62e308487	b5668aed-dbb4-4d19-918e-c4e62e308487	{"sub": "b5668aed-dbb4-4d19-918e-c4e62e308487", "email": "mh.loja.ahu@gmail.com", "full_name": "Loja Ahu", "email_verified": false, "phone_verified": false}	email	2026-06-01 00:51:42.785409+00	2026-06-01 00:51:42.785478+00	2026-06-01 00:51:42.785478+00	f988d60c-637e-44ee-bbc2-fcb3b1dcdfff
d68a59d3-2331-4ada-a377-60659501c047	d68a59d3-2331-4ada-a377-60659501c047	{"sub": "d68a59d3-2331-4ada-a377-60659501c047", "email": "mh.loja.altoxv@gmail.com", "full_name": "Loja Alto XV", "email_verified": false, "phone_verified": false}	email	2026-06-01 00:52:00.10771+00	2026-06-01 00:52:00.107756+00	2026-06-01 00:52:00.107756+00	af7f055a-e6ab-469a-83d4-acac7c4d6e18
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_clients" ("id", "client_secret_hash", "registration_type", "redirect_uris", "grant_types", "client_name", "client_uri", "logo_uri", "created_at", "updated_at", "deleted_at", "client_type", "token_endpoint_auth_method") FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") FROM stdin;
2b94c050-86b9-47e2-8cb9-5650856c3c7d	d956fdab-0d1c-463c-9cfc-63f42d3645a5	2026-05-30 16:10:49.692034+00	2026-05-30 16:10:49.692034+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36	179.130.82.135	\N	\N	\N	\N	\N
2295f059-3795-4deb-8084-af6532642d5b	16ddd940-9f73-4313-ba08-9ee96735181c	2026-05-29 15:55:10.087181+00	2026-05-29 20:45:16.526821+00	\N	aal1	\N	2026-05-29 20:45:16.526712	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	168.181.51.162	\N	\N	\N	\N	\N
ddc31fbd-2952-4023-a531-d6023e58a775	cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3	2026-05-30 02:51:50.617592+00	2026-05-30 02:51:50.617592+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	168.181.49.193	\N	\N	\N	\N	\N
fe2c4519-bcab-40e8-ad42-37c32c485f26	d956fdab-0d1c-463c-9cfc-63f42d3645a5	2026-05-29 19:09:47.751629+00	2026-05-30 18:09:46.728253+00	\N	aal1	\N	2026-05-30 18:09:46.728151	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	168.181.51.162	\N	\N	\N	\N	\N
5088a507-87e6-40c6-b4aa-17b85f4633c9	d956fdab-0d1c-463c-9cfc-63f42d3645a5	2026-05-29 19:09:52.343064+00	2026-05-30 18:09:57.279146+00	\N	aal1	\N	2026-05-30 18:09:57.279046	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	168.181.51.162	\N	\N	\N	\N	\N
6cbe0e20-2641-4057-95c4-ba8c3f5f4a38	d956fdab-0d1c-463c-9cfc-63f42d3645a5	2026-05-30 19:22:02.933932+00	2026-05-30 19:22:02.933932+00	\N	aal1	\N	\N	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Safari/537.36	138.36.34.20	\N	\N	\N	\N	\N
21cb8fc6-1c87-4b9d-aade-75666473f41c	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-31 20:09:39.751348+00	2026-05-31 22:08:26.387951+00	\N	aal1	\N	2026-05-31 22:08:26.387858	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	138.36.34.20	\N	\N	\N	\N	\N
ada74763-3efa-4a0c-b189-f5b998b2dc7d	cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3	2026-05-31 21:08:58.36975+00	2026-05-31 22:11:36.322517+00	\N	aal1	\N	2026-05-31 22:11:36.32241	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	138.36.34.20	\N	\N	\N	\N	\N
a4926327-3d12-4597-ad35-537363d9b4e0	d956fdab-0d1c-463c-9cfc-63f42d3645a5	2026-05-31 16:23:08.374558+00	2026-05-31 16:23:08.374558+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36	138.36.34.20	\N	\N	\N	\N	\N
77e8d0e4-0f6a-43c0-919c-0d287c4d1d68	d956fdab-0d1c-463c-9cfc-63f42d3645a5	2026-05-31 16:24:32.47885+00	2026-05-31 16:24:32.47885+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36	138.36.34.20	\N	\N	\N	\N	\N
7693ce60-76fd-4fb6-93c4-13a7bf32e93e	b5668aed-dbb4-4d19-918e-c4e62e308487	2026-06-01 01:06:12.589515+00	2026-06-01 01:06:12.589515+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	168.194.163.36	\N	\N	\N	\N	\N
3d8e72b2-9870-4c64-a29f-6677ff230d97	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-29 15:12:38.99101+00	2026-05-29 15:12:38.99101+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	168.181.51.162	\N	\N	\N	\N	\N
7e2b8dca-0cb3-467f-a1bc-3eb576f1b82e	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-06-01 00:35:46.835486+00	2026-06-01 02:36:44.262293+00	\N	aal1	\N	2026-06-01 02:36:44.262193	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	168.194.163.36	\N	\N	\N	\N	\N
2c84ba70-aebf-4cdb-8e8f-42bd368fb819	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-31 19:36:13.086575+00	2026-05-31 19:36:13.086575+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	138.36.34.20	\N	\N	\N	\N	\N
efb7a22e-97dd-4b85-8a55-36b02016670a	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-29 14:17:37.175668+00	2026-05-29 16:00:37.831108+00	\N	aal1	\N	2026-05-29 16:00:37.831013	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	168.181.51.162	\N	\N	\N	\N	\N
fc7564be-491e-4a50-8e01-54c91258a91f	d956fdab-0d1c-463c-9cfc-63f42d3645a5	2026-05-30 16:13:15.908163+00	2026-05-30 16:13:15.908163+00	\N	aal1	\N	\N	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36	179.130.82.135	\N	\N	\N	\N	\N
f96f3c03-b421-459d-8c62-555e74e20d68	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-31 20:08:27.135475+00	2026-05-31 20:08:27.135475+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	138.36.34.20	\N	\N	\N	\N	\N
45457d85-0820-4e04-b161-0dfd55b30502	054e1fc1-7d77-4ae0-addb-13e440f53d6b	2026-05-31 20:43:34.589931+00	2026-05-31 20:43:34.589931+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	138.36.34.20	\N	\N	\N	\N	\N
d42dca1f-bd1b-46eb-b483-399ee1c2b766	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-31 21:35:00.795817+00	2026-05-31 21:35:00.795817+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	138.36.34.20	\N	\N	\N	\N	\N
30cce33e-8e23-4c01-b3c8-dfcf417ab09a	b5668aed-dbb4-4d19-918e-c4e62e308487	2026-06-01 00:51:42.808613+00	2026-06-01 00:51:42.808613+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	168.194.163.36	\N	\N	\N	\N	\N
0e17dd08-e043-4369-a964-e931bb4b04c9	d68a59d3-2331-4ada-a377-60659501c047	2026-06-01 00:52:00.120765+00	2026-06-01 00:52:00.120765+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	168.194.163.36	\N	\N	\N	\N	\N
1fdab246-ae0d-4e09-afa7-f0e87393308a	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-06-01 00:49:35.656149+00	2026-06-01 01:48:29.488881+00	\N	aal1	\N	2026-06-01 01:48:29.48878	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	168.194.163.36	\N	\N	\N	\N	\N
43ddeca3-02d1-4cf6-8139-33334c2ec6e0	16ddd940-9f73-4313-ba08-9ee96735181c	2026-05-29 15:04:38.120224+00	2026-05-29 15:04:38.120224+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	168.181.51.162	\N	\N	\N	\N	\N
883331c0-7448-4170-b060-2827d9802e4c	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-29 15:18:31.320795+00	2026-05-29 15:18:31.320795+00	\N	aal1	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	168.181.51.162	\N	\N	\N	\N	\N
84f77e46-d507-4e73-bd21-77b2ad536f9b	d956fdab-0d1c-463c-9cfc-63f42d3645a5	2026-05-30 03:01:21.228049+00	2026-06-01 02:01:54.092736+00	\N	aal1	\N	2026-06-01 02:01:54.092636	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36	179.130.82.135	\N	\N	\N	\N	\N
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
2c84ba70-aebf-4cdb-8e8f-42bd368fb819	2026-05-31 19:36:13.13792+00	2026-05-31 19:36:13.13792+00	password	6240fdec-5630-413c-8a84-365d477e75db
f96f3c03-b421-459d-8c62-555e74e20d68	2026-05-31 20:08:27.213682+00	2026-05-31 20:08:27.213682+00	password	f906f4c2-9a84-465e-9c71-2bdb1756bee6
21cb8fc6-1c87-4b9d-aade-75666473f41c	2026-05-31 20:09:39.76301+00	2026-05-31 20:09:39.76301+00	password	9495e535-7e9c-421f-b558-e5ebfb89d1be
45457d85-0820-4e04-b161-0dfd55b30502	2026-05-31 20:43:34.680958+00	2026-05-31 20:43:34.680958+00	password	a69c3af9-813c-4e78-95e2-f330a1280075
ada74763-3efa-4a0c-b189-f5b998b2dc7d	2026-05-31 21:08:58.39287+00	2026-05-31 21:08:58.39287+00	password	86dd372d-0f61-459c-a653-85c00eefc9dc
d42dca1f-bd1b-46eb-b483-399ee1c2b766	2026-05-31 21:35:00.86178+00	2026-05-31 21:35:00.86178+00	password	c3ade81a-0739-4710-ba4f-051d32c045ee
7e2b8dca-0cb3-467f-a1bc-3eb576f1b82e	2026-06-01 00:35:46.903303+00	2026-06-01 00:35:46.903303+00	password	1f84cc11-fc70-45e1-8520-2488e1a6b6ae
1fdab246-ae0d-4e09-afa7-f0e87393308a	2026-06-01 00:49:35.684872+00	2026-06-01 00:49:35.684872+00	password	961e9c19-1126-4717-838e-a376c4a1cc23
30cce33e-8e23-4c01-b3c8-dfcf417ab09a	2026-06-01 00:51:42.813899+00	2026-06-01 00:51:42.813899+00	password	b3f89da6-4d53-46eb-a56b-4ce48cf4d869
0e17dd08-e043-4369-a964-e931bb4b04c9	2026-06-01 00:52:00.122775+00	2026-06-01 00:52:00.122775+00	password	348b9c51-0338-4b2c-afa3-afeedac16f8b
7693ce60-76fd-4fb6-93c4-13a7bf32e93e	2026-06-01 01:06:12.645593+00	2026-06-01 01:06:12.645593+00	password	807138e0-61b6-4579-87b7-40b0f998e64f
efb7a22e-97dd-4b85-8a55-36b02016670a	2026-05-29 14:17:37.212574+00	2026-05-29 14:17:37.212574+00	password	d758da8c-48cc-42cf-8427-0274230f9454
43ddeca3-02d1-4cf6-8139-33334c2ec6e0	2026-05-29 15:04:38.138299+00	2026-05-29 15:04:38.138299+00	password	c04f96bc-d0a5-4cb6-b2e4-a7d44a92a564
3d8e72b2-9870-4c64-a29f-6677ff230d97	2026-05-29 15:12:39.017062+00	2026-05-29 15:12:39.017062+00	password	730a5cac-5edb-4ec3-be47-269c4fd6f27b
883331c0-7448-4170-b060-2827d9802e4c	2026-05-29 15:18:31.354773+00	2026-05-29 15:18:31.354773+00	password	e6750eb0-7b4d-4b98-9115-719a71aa4f01
2295f059-3795-4deb-8084-af6532642d5b	2026-05-29 15:55:10.133194+00	2026-05-29 15:55:10.133194+00	password	e37a5fe3-ea16-4065-9b93-e2c5f4253ce4
fe2c4519-bcab-40e8-ad42-37c32c485f26	2026-05-29 19:09:47.766123+00	2026-05-29 19:09:47.766123+00	password	f2c60582-ad68-4111-96ad-b0f7ac24e320
5088a507-87e6-40c6-b4aa-17b85f4633c9	2026-05-29 19:09:52.34501+00	2026-05-29 19:09:52.34501+00	password	a110b3ab-4135-4664-b8c2-1f627d5a061f
ddc31fbd-2952-4023-a531-d6023e58a775	2026-05-30 02:51:50.690314+00	2026-05-30 02:51:50.690314+00	password	b006fde2-04e4-413e-9b88-35215756ed14
84f77e46-d507-4e73-bd21-77b2ad536f9b	2026-05-30 03:01:21.246741+00	2026-05-30 03:01:21.246741+00	password	b35b0612-3710-451c-a81f-4301a4d59250
2b94c050-86b9-47e2-8cb9-5650856c3c7d	2026-05-30 16:10:49.745348+00	2026-05-30 16:10:49.745348+00	password	3f911964-9d60-407d-a9e0-019939de2b4b
fc7564be-491e-4a50-8e01-54c91258a91f	2026-05-30 16:13:15.924186+00	2026-05-30 16:13:15.924186+00	password	77518e29-7000-49ff-9a80-54fa40ebe064
6cbe0e20-2641-4057-95c4-ba8c3f5f4a38	2026-05-30 19:22:02.976695+00	2026-05-30 19:22:02.976695+00	password	556762f6-4d76-4cb0-8c34-4bc037f11ca9
a4926327-3d12-4597-ad35-537363d9b4e0	2026-05-31 16:23:08.448045+00	2026-05-31 16:23:08.448045+00	password	b8dd489d-a9c5-4c84-b1c8-876976354a02
77e8d0e4-0f6a-43c0-919c-0d287c4d1d68	2026-05-31 16:24:32.483782+00	2026-05-31 16:24:32.483782+00	password	d1d2547d-4d3d-4921-b0a4-4fd83de9c677
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid", "last_webauthn_challenge_data") FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_authorizations" ("id", "authorization_id", "client_id", "user_id", "redirect_uri", "scope", "state", "resource", "code_challenge", "code_challenge_method", "response_type", "status", "authorization_code", "created_at", "expires_at", "approved_at", "nonce") FROM stdin;
\.


--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_client_states" ("id", "provider_type", "code_verifier", "created_at") FROM stdin;
\.


--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."oauth_consents" ("id", "user_id", "client_id", "scopes", "granted_at", "revoked_at") FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
00000000-0000-0000-0000-000000000000	895	udyo44v3wvt2	35cae5eb-f980-4be0-9998-ac8173ed2afc	f	2026-05-31 21:35:00.820715+00	2026-05-31 21:35:00.820715+00	\N	d42dca1f-bd1b-46eb-b483-399ee1c2b766
00000000-0000-0000-0000-000000000000	816	pktgp3mdhjfo	1d621888-613a-4a15-b796-3c4120f51af2	f	2026-05-29 15:18:31.334072+00	2026-05-29 15:18:31.334072+00	\N	883331c0-7448-4170-b060-2827d9802e4c
00000000-0000-0000-0000-000000000000	855	bjjya25olbje	d956fdab-0d1c-463c-9cfc-63f42d3645a5	t	2026-05-30 18:54:42.862521+00	2026-05-31 22:19:16.769257+00	do7cqkf4gx6p	84f77e46-d507-4e73-bd21-77b2ad536f9b
00000000-0000-0000-0000-000000000000	904	cdufst5adwoy	b5668aed-dbb4-4d19-918e-c4e62e308487	f	2026-06-01 01:06:12.611881+00	2026-06-01 01:06:12.611881+00	\N	7693ce60-76fd-4fb6-93c4-13a7bf32e93e
00000000-0000-0000-0000-000000000000	891	xq3rlrwqdihm	35cae5eb-f980-4be0-9998-ac8173ed2afc	t	2026-05-31 20:09:39.755727+00	2026-05-31 21:10:03.27819+00	\N	21cb8fc6-1c87-4b9d-aade-75666473f41c
00000000-0000-0000-0000-000000000000	832	jso72ne5yxsr	cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3	f	2026-05-30 02:51:50.647065+00	2026-05-30 02:51:50.647065+00	\N	ddc31fbd-2952-4023-a531-d6023e58a775
00000000-0000-0000-0000-000000000000	878	kypxx464wh54	d956fdab-0d1c-463c-9cfc-63f42d3645a5	f	2026-05-31 16:23:08.402758+00	2026-05-31 16:23:08.402758+00	\N	a4926327-3d12-4597-ad35-537363d9b4e0
00000000-0000-0000-0000-000000000000	879	z54mtrlqmany	d956fdab-0d1c-463c-9cfc-63f42d3645a5	f	2026-05-31 16:24:32.480438+00	2026-05-31 16:24:32.480438+00	\N	77e8d0e4-0f6a-43c0-919c-0d287c4d1d68
00000000-0000-0000-0000-000000000000	810	chgyarvrn5hh	1d621888-613a-4a15-b796-3c4120f51af2	t	2026-05-29 14:17:37.191484+00	2026-05-29 16:00:37.825865+00	\N	efb7a22e-97dd-4b85-8a55-36b02016670a
00000000-0000-0000-0000-000000000000	905	qfhy74i7bquk	35cae5eb-f980-4be0-9998-ac8173ed2afc	t	2026-06-01 01:35:19.750732+00	2026-06-01 02:36:44.241307+00	3d7uiycoli6q	7e2b8dca-0cb3-467f-a1bc-3eb576f1b82e
00000000-0000-0000-0000-000000000000	892	tyqg2bti4bvl	054e1fc1-7d77-4ae0-addb-13e440f53d6b	f	2026-05-31 20:43:34.627608+00	2026-05-31 20:43:34.627608+00	\N	45457d85-0820-4e04-b161-0dfd55b30502
00000000-0000-0000-0000-000000000000	833	n4b4pdmugdza	d956fdab-0d1c-463c-9cfc-63f42d3645a5	t	2026-05-30 03:01:21.229638+00	2026-05-30 04:54:39.772279+00	\N	84f77e46-d507-4e73-bd21-77b2ad536f9b
00000000-0000-0000-0000-000000000000	825	ltuorezg6a4e	d956fdab-0d1c-463c-9cfc-63f42d3645a5	t	2026-05-29 19:09:47.763676+00	2026-05-30 18:09:46.711056+00	\N	fe2c4519-bcab-40e8-ad42-37c32c485f26
00000000-0000-0000-0000-000000000000	826	fgu3wipjddzc	d956fdab-0d1c-463c-9cfc-63f42d3645a5	t	2026-05-29 19:09:52.343831+00	2026-05-30 18:09:57.274131+00	\N	5088a507-87e6-40c6-b4aa-17b85f4633c9
00000000-0000-0000-0000-000000000000	894	hhvlqzpdbaev	35cae5eb-f980-4be0-9998-ac8173ed2afc	t	2026-05-31 21:10:03.278817+00	2026-05-31 22:08:26.375925+00	xq3rlrwqdihm	21cb8fc6-1c87-4b9d-aade-75666473f41c
00000000-0000-0000-0000-000000000000	897	egjdx5ik45xk	35cae5eb-f980-4be0-9998-ac8173ed2afc	f	2026-05-31 22:08:26.383294+00	2026-05-31 22:08:26.383294+00	hhvlqzpdbaev	21cb8fc6-1c87-4b9d-aade-75666473f41c
00000000-0000-0000-0000-000000000000	893	gryrfwp5x7p2	cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3	t	2026-05-31 21:08:58.379694+00	2026-05-31 22:11:36.316746+00	\N	ada74763-3efa-4a0c-b189-f5b998b2dc7d
00000000-0000-0000-0000-000000000000	906	ciusia7j3tsa	35cae5eb-f980-4be0-9998-ac8173ed2afc	f	2026-06-01 01:48:29.47437+00	2026-06-01 01:48:29.47437+00	wjecggdvdh3f	1fdab246-ae0d-4e09-afa7-f0e87393308a
00000000-0000-0000-0000-000000000000	818	tpyn2qb6w4lk	16ddd940-9f73-4313-ba08-9ee96735181c	t	2026-05-29 15:55:10.10989+00	2026-05-29 20:45:16.486624+00	\N	2295f059-3795-4deb-8084-af6532642d5b
00000000-0000-0000-0000-000000000000	835	do7cqkf4gx6p	d956fdab-0d1c-463c-9cfc-63f42d3645a5	t	2026-05-30 04:54:39.790416+00	2026-05-30 18:54:42.834774+00	n4b4pdmugdza	84f77e46-d507-4e73-bd21-77b2ad536f9b
00000000-0000-0000-0000-000000000000	858	khft6v6jncm3	d956fdab-0d1c-463c-9cfc-63f42d3645a5	f	2026-05-30 19:22:02.953056+00	2026-05-30 19:22:02.953056+00	\N	6cbe0e20-2641-4057-95c4-ba8c3f5f4a38
00000000-0000-0000-0000-000000000000	898	tnnfqcqed7pp	cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3	f	2026-05-31 22:11:36.317526+00	2026-05-31 22:11:36.317526+00	gryrfwp5x7p2	ada74763-3efa-4a0c-b189-f5b998b2dc7d
00000000-0000-0000-0000-000000000000	819	ohom2ticypeu	1d621888-613a-4a15-b796-3c4120f51af2	f	2026-05-29 16:00:37.827803+00	2026-05-29 16:00:37.827803+00	chgyarvrn5hh	efb7a22e-97dd-4b85-8a55-36b02016670a
00000000-0000-0000-0000-000000000000	907	675zlt3bgqco	d956fdab-0d1c-463c-9cfc-63f42d3645a5	f	2026-06-01 02:01:54.075434+00	2026-06-01 02:01:54.075434+00	l2aygrx3y4dt	84f77e46-d507-4e73-bd21-77b2ad536f9b
00000000-0000-0000-0000-000000000000	843	4f3wu5ww62w6	d956fdab-0d1c-463c-9cfc-63f42d3645a5	f	2026-05-30 16:10:49.721526+00	2026-05-30 16:10:49.721526+00	\N	2b94c050-86b9-47e2-8cb9-5650856c3c7d
00000000-0000-0000-0000-000000000000	899	l2aygrx3y4dt	d956fdab-0d1c-463c-9cfc-63f42d3645a5	t	2026-05-31 22:19:16.780518+00	2026-06-01 02:01:54.059187+00	bjjya25olbje	84f77e46-d507-4e73-bd21-77b2ad536f9b
00000000-0000-0000-0000-000000000000	829	umscqbk3tvoo	16ddd940-9f73-4313-ba08-9ee96735181c	f	2026-05-29 20:45:16.501854+00	2026-05-29 20:45:16.501854+00	tpyn2qb6w4lk	2295f059-3795-4deb-8084-af6532642d5b
00000000-0000-0000-0000-000000000000	908	7gl6knvjjmdm	35cae5eb-f980-4be0-9998-ac8173ed2afc	f	2026-06-01 02:36:44.248344+00	2026-06-01 02:36:44.248344+00	qfhy74i7bquk	7e2b8dca-0cb3-467f-a1bc-3eb576f1b82e
00000000-0000-0000-0000-000000000000	844	wakvqdnqx4m6	d956fdab-0d1c-463c-9cfc-63f42d3645a5	f	2026-05-30 16:13:15.914235+00	2026-05-30 16:13:15.914235+00	\N	fc7564be-491e-4a50-8e01-54c91258a91f
00000000-0000-0000-0000-000000000000	851	4ht6pvv43ii5	d956fdab-0d1c-463c-9cfc-63f42d3645a5	f	2026-05-30 18:09:46.717706+00	2026-05-30 18:09:46.717706+00	ltuorezg6a4e	fe2c4519-bcab-40e8-ad42-37c32c485f26
00000000-0000-0000-0000-000000000000	852	ynv56fv2tsoy	d956fdab-0d1c-463c-9cfc-63f42d3645a5	f	2026-05-30 18:09:57.275936+00	2026-05-30 18:09:57.275936+00	fgu3wipjddzc	5088a507-87e6-40c6-b4aa-17b85f4633c9
00000000-0000-0000-0000-000000000000	814	54vka5wevnco	16ddd940-9f73-4313-ba08-9ee96735181c	f	2026-05-29 15:04:38.125672+00	2026-05-29 15:04:38.125672+00	\N	43ddeca3-02d1-4cf6-8139-33334c2ec6e0
00000000-0000-0000-0000-000000000000	889	y3geixmu3f2b	35cae5eb-f980-4be0-9998-ac8173ed2afc	f	2026-05-31 19:36:13.107056+00	2026-05-31 19:36:13.107056+00	\N	2c84ba70-aebf-4cdb-8e8f-42bd368fb819
00000000-0000-0000-0000-000000000000	900	3d7uiycoli6q	35cae5eb-f980-4be0-9998-ac8173ed2afc	t	2026-06-01 00:35:46.866236+00	2026-06-01 01:35:19.737294+00	\N	7e2b8dca-0cb3-467f-a1bc-3eb576f1b82e
00000000-0000-0000-0000-000000000000	815	imzmexjykgye	1d621888-613a-4a15-b796-3c4120f51af2	f	2026-05-29 15:12:38.99744+00	2026-05-29 15:12:38.99744+00	\N	3d8e72b2-9870-4c64-a29f-6677ff230d97
00000000-0000-0000-0000-000000000000	890	okqdjlwai74z	35cae5eb-f980-4be0-9998-ac8173ed2afc	f	2026-05-31 20:08:27.162979+00	2026-05-31 20:08:27.162979+00	\N	f96f3c03-b421-459d-8c62-555e74e20d68
00000000-0000-0000-0000-000000000000	902	eit7jth4cykq	b5668aed-dbb4-4d19-918e-c4e62e308487	f	2026-06-01 00:51:42.810743+00	2026-06-01 00:51:42.810743+00	\N	30cce33e-8e23-4c01-b3c8-dfcf417ab09a
00000000-0000-0000-0000-000000000000	903	onso4e6ibsmk	d68a59d3-2331-4ada-a377-60659501c047	f	2026-06-01 00:52:00.12158+00	2026-06-01 00:52:00.12158+00	\N	0e17dd08-e043-4369-a964-e931bb4b04c9
00000000-0000-0000-0000-000000000000	901	wjecggdvdh3f	35cae5eb-f980-4be0-9998-ac8173ed2afc	t	2026-06-01 00:49:35.669591+00	2026-06-01 01:48:29.465888+00	\N	1fdab246-ae0d-4e09-afa7-f0e87393308a
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at", "disabled") FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."webauthn_challenges" ("id", "user_id", "challenge_type", "session_data", "created_at", "expires_at") FROM stdin;
\.


--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."webauthn_credentials" ("id", "user_id", "credential_id", "public_key", "attestation_type", "aaguid", "sign_count", "transports", "backup_eligible", "backed_up", "friendly_name", "created_at", "updated_at", "last_used_at") FROM stdin;
\.


--
-- Data for Name: Checklist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."Checklist" ("id", "created_at", "checklist", "person", "store", "massas", "brownies", "panos", "money_data") FROM stdin;
90	2025-03-07 22:32:21.568387+00	Checklist de Fechamento	Henrique	ahu	\N	\N	\N	\N
41	2025-02-22 15:00:14.298175+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
42	2025-02-22 15:08:27.507463+00	Checklist de Abertura	Geovana	ahu	\N	\N	\N	\N
45	2025-02-23 15:00:24.104068+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
44	2025-02-22 22:20:11.926428+00	Checklist de Fechamento	Geovana	ahu	\N	\N	\N	\N
43	2025-02-22 22:09:13.877924+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
46	2025-02-23 15:32:11.265476+00	Checklist de Abertura	Geovana	ahu	\N	\N	\N	\N
48	2025-02-23 22:26:50.47819+00	Checklist de Fechamento	Geovana	ahu	\N	\N	\N	\N
47	2025-02-23 22:08:54.976477+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
50	2025-02-24 15:05:53.013935+00	Checklist de Abertura	Geovana	ahu	\N	\N	\N	\N
51	2025-02-24 15:09:12.05398+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
52	2025-02-24 22:04:51.20059+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
53	2025-02-24 22:37:49.394953+00	Checklist de Fechamento	Geovana	ahu	\N	\N	\N	\N
54	2025-02-25 14:53:14.935837+00	Checklist de Abertura	Geovana	ahu	\N	\N	\N	\N
55	2025-02-25 15:23:35.976316+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
56	2025-02-25 22:14:41.770982+00	Checklist de Fechamento	Henrique	ahu	\N	\N	\N	\N
57	2025-02-25 22:16:07.788861+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
58	2025-02-26 14:59:40.245033+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
59	2025-02-26 15:04:42.322555+00	Checklist de Abertura	Henrique	ahu	\N	\N	\N	\N
60	2025-02-26 22:03:28.609325+00	Checklist de Fechamento	Henrique	ahu	\N	\N	\N	\N
61	2025-02-26 22:07:42.650192+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
62	2025-02-27 14:57:55.380016+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
63	2025-02-27 22:06:16.359561+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
64	2025-02-28 14:57:40.426227+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
65	2025-02-28 15:15:58.438299+00	Checklist de Abertura	Geovana	ahu	\N	\N	\N	\N
66	2025-02-28 22:06:30.722403+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
67	2025-02-28 23:00:41.866073+00	Checklist de Fechamento	Geovana	ahu	\N	\N	\N	\N
68	2025-03-01 14:57:40.885552+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
69	2025-03-01 15:01:48.593314+00	Checklist de Abertura	Geovana	ahu	\N	\N	\N	\N
70	2025-03-01 22:04:38.353608+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
71	2025-03-02 14:58:38.416059+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
72	2025-03-02 14:59:19.398815+00	Checklist de Abertura	Geovana	ahu	\N	\N	\N	\N
73	2025-03-02 22:05:14.027842+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
74	2025-03-03 15:00:18.326451+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
75	2025-03-03 15:03:14.099446+00	Checklist de Abertura	Geovana	ahu	\N	\N	\N	\N
76	2025-03-03 22:09:29.03856+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
77	2025-03-04 15:09:18.416916+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
78	2025-03-04 15:09:50.358093+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
79	2025-03-04 22:21:46.745432+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
80	2025-03-05 15:01:23.434712+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
81	2025-03-05 22:04:53.257681+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
82	2025-03-05 22:05:56.39024+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
83	2025-03-06 14:57:32.100474+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
84	2025-03-06 15:03:50.7975+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
85	2025-03-06 22:05:51.782367+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
86	2025-03-06 22:09:02.359597+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
87	2025-03-07 15:02:23.527581+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
88	2025-03-07 16:31:46.571738+00	Checklist de Abertura	Henrique	ahu	\N	\N	\N	\N
89	2025-03-07 22:04:28.499989+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
91	2025-03-08 14:46:25.757946+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
92	2025-03-08 15:20:31.219938+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
93	2025-03-08 22:07:43.025892+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
94	2025-03-08 22:14:39.544559+00	Checklist de Fechamento	Henrique	ahu	\N	\N	\N	\N
95	2025-03-09 14:47:34.354555+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
96	2025-03-09 15:04:04.961556+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
97	2025-03-09 22:00:48.211986+00	Checklist de Fechamento	Henrique	ahu	\N	\N	\N	\N
98	2025-03-09 22:03:59.228675+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
99	2025-03-10 14:56:48.97709+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
100	2025-03-10 15:02:21.927673+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
101	2025-03-10 22:00:14.928527+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
102	2025-03-10 22:04:43.277709+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
103	2025-03-11 14:55:01.577867+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
104	2025-03-11 15:09:26.048332+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
105	2025-03-11 21:54:24.531681+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
106	2025-03-11 22:04:31.119937+00	Checklist de Fechamento	Henrique	altoxv	\N	\N	\N	\N
107	2025-03-12 14:51:30.986122+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
108	2025-03-12 21:30:55.762982+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
109	2025-03-12 22:03:44.48208+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
110	2025-03-13 15:02:31.082933+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
111	2025-03-13 15:09:09.49636+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
112	2025-03-13 22:04:44.654755+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
113	2025-03-13 22:09:09.303376+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
114	2025-03-14 14:52:21.479856+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
115	2025-03-14 22:05:54.283044+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
116	2025-03-15 15:05:03.485437+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
117	2025-03-15 15:06:41.030349+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
118	2025-03-15 21:34:49.970014+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
119	2025-03-15 21:36:42.514576+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
120	2025-03-16 14:42:09.648634+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
121	2025-03-16 22:03:47.226572+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
122	2025-03-17 14:54:10.100719+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
123	2025-03-17 15:00:17.346819+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
124	2025-03-17 22:02:39.239066+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
125	2025-03-17 22:04:09.268196+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
126	2025-03-18 14:50:51.29548+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
127	2025-03-18 14:51:23.247346+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
128	2025-03-18 21:59:30.356159+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
129	2025-03-19 15:00:10.405028+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
130	2025-03-19 15:00:31.94316+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
131	2025-03-19 22:04:16.525956+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
132	2025-03-19 22:07:23.685079+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
133	2025-03-20 15:06:55.195703+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
134	2025-03-20 18:59:27.264253+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
135	2025-03-20 22:00:57.828105+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
136	2025-03-20 22:04:42.140346+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
137	2025-03-21 14:46:40.709843+00	Checklist de Abertura	Henrique	ahu	\N	\N	\N	\N
138	2025-03-21 15:06:56.516711+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
139	2025-03-21 22:06:25.73446+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
140	2025-03-22 14:56:33.45409+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
141	2025-03-22 15:00:50.2501+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
142	2025-03-22 21:52:55.029137+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
143	2025-03-22 22:02:50.870231+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
144	2025-03-23 15:04:13.407603+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
145	2025-03-23 22:04:54.276674+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
146	2025-03-23 22:07:40.32789+00	Checklist de Fechamento	Marina	ahu	\N	\N	\N	\N
147	2025-03-24 15:01:37.17507+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
148	2025-03-24 15:04:50.668576+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
157	2025-03-24 22:03:57.192679+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
158	2025-03-25 14:49:54.321163+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
159	2025-03-25 15:05:39.769533+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
160	2025-03-25 22:29:44.605807+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
161	2025-03-26 14:54:32.298395+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
162	2025-03-26 15:02:56.080922+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
163	2025-03-26 21:55:42.68945+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
164	2025-03-26 22:04:19.60573+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
165	2025-03-27 14:58:37.71404+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
166	2025-03-27 15:01:52.280983+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
167	2025-03-27 22:06:01.465317+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
168	2025-03-27 22:07:04.063671+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
169	2025-03-28 15:01:29.038635+00	Checklist de Abertura	Sarah	ahu	\N	\N	\N	\N
170	2025-03-28 15:10:22.860627+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
171	2025-03-28 22:05:45.661373+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
172	2025-03-28 22:11:52.091711+00	Checklist de Fechamento	Sarah	ahu	\N	\N	\N	\N
173	2025-03-29 14:51:32.316076+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
174	2025-03-29 14:55:22.310789+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
175	2025-03-29 21:58:56.318177+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
176	2025-03-29 22:02:25.637853+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
177	2025-03-30 14:41:06.677927+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
178	2025-03-30 14:58:31.12909+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
179	2025-03-30 22:02:12.320191+00	Checklist de Fechamento	Henrique	ahu	\N	\N	\N	\N
180	2025-03-30 22:06:56.859929+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
181	2025-03-31 14:57:17.469145+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
182	2025-03-31 18:59:50.208146+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
183	2025-03-31 22:04:01.936751+00	Checklist de Fechamento		ahu	\N	\N	\N	\N
184	2025-03-31 22:11:14.645043+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
185	2025-04-01 14:49:53.031425+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
186	2025-04-01 14:59:03.415952+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
187	2025-04-01 22:14:35.033606+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
188	2025-04-02 15:02:14.227537+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
189	2025-04-02 15:05:34.112673+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
190	2025-04-02 21:56:51.590404+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
191	2025-04-02 22:03:20.265956+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
192	2025-04-03 14:59:40.298734+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
193	2025-04-03 15:00:17.667644+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
194	2025-04-03 21:53:10.112894+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
195	2025-04-03 22:12:41.715713+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
196	2025-04-04 14:53:03.12537+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
197	2025-04-04 21:55:04.298701+00	Checklist de Fechamento	Marina	ahu	\N	\N	\N	\N
198	2025-04-04 22:03:58.744282+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
199	2025-04-05 14:51:50.94772+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
200	2025-04-05 15:00:04.87769+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
201	2025-04-05 21:31:37.672829+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
202	2025-04-05 21:35:15.521609+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
203	2025-04-06 14:46:10.371184+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
204	2025-04-06 21:48:37.205234+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
205	2025-04-07 14:48:25.233973+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
206	2025-04-07 15:05:18.210228+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
207	2025-04-07 21:12:45.530695+00	Checklist de Fechamento		ahu	\N	\N	\N	\N
208	2025-04-07 22:03:17.825329+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
209	2025-04-08 14:45:52.899432+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
210	2025-04-08 18:23:35.956861+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
211	2025-04-08 21:57:19.902232+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
212	2025-04-08 22:08:39.633969+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
213	2025-04-09 14:53:37.824966+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
214	2025-04-09 15:03:06.311035+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
215	2025-04-09 21:53:33.032451+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
216	2025-04-09 22:03:20.72752+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
217	2025-04-10 15:04:09.48851+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
218	2025-04-10 15:10:33.030629+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
219	2025-04-10 22:04:53.269718+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
220	2025-04-11 14:55:52.420743+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
221	2025-04-11 22:05:05.968056+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
222	2025-04-12 14:50:37.793201+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
223	2025-04-12 15:25:53.441751+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
224	2025-04-12 22:03:38.212673+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
226	2025-04-13 14:41:43.886182+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
227	2025-04-13 15:03:15.495025+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
228	2025-04-13 21:27:02.678541+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
229	2025-04-13 21:36:29.825539+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
230	2025-04-14 14:51:43.901317+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
231	2025-04-14 15:03:02.031931+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
232	2025-04-14 21:57:16.431882+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
233	2025-04-14 22:03:50.305434+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
234	2025-04-15 14:50:25.772432+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
235	2025-04-15 16:05:55.035299+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
236	2025-04-15 21:53:48.04652+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
237	2025-04-15 22:06:12.601284+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
238	2025-04-16 14:53:50.307228+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
239	2025-04-16 15:03:53.052447+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
240	2025-04-16 21:53:11.334218+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
241	2025-04-16 22:05:05.280487+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
242	2025-04-17 14:58:27.73723+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
243	2025-04-17 15:02:04.333805+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
244	2025-04-17 21:56:43.274202+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
245	2025-04-17 22:04:39.729666+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
246	2025-04-18 14:55:16.011449+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
247	2025-04-18 22:02:08.212892+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
248	2025-04-19 14:52:12.468171+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
249	2025-04-19 22:02:43.081158+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
250	2025-04-20 14:45:19.770484+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
251	2025-04-20 17:00:54.028421+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
252	2025-04-20 21:52:40.007197+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
253	2025-04-20 22:09:07.758093+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
254	2025-04-21 14:54:46.552894+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
255	2025-04-21 15:02:14.591742+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
260	2025-04-21 21:56:54.883303+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
261	2025-04-21 22:02:51.260373+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
262	2025-04-22 15:12:47.81947+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
263	2025-04-22 15:21:02.304558+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
270	2025-04-22 21:53:47.7994+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
271	2025-04-22 22:05:18.906918+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
272	2025-04-23 14:54:58.318148+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
273	2025-04-23 15:50:05.578528+00	Checklist de Abertura		ahu	\N	\N	\N	\N
274	2025-04-23 15:53:43.206183+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
275	2025-04-23 21:56:00.495226+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
276	2025-04-23 22:02:03.38679+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
277	2025-04-24 14:57:33.12618+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
278	2025-04-24 14:59:27.413713+00	Checklist de Abertura	Alisson	ahu	\N	\N	\N	\N
279	2025-04-24 21:27:11.937537+00	Checklist de Fechamento	Alisson	ahu	\N	\N	\N	\N
280	2025-04-24 21:35:52.201189+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
281	2025-04-25 14:55:36.248475+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
282	2025-04-25 14:56:10.435377+00	Checklist de Abertura	Henrique	ahu	\N	\N	\N	\N
285	2025-04-25 22:04:04.345685+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
286	2025-04-26 14:49:47.968439+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
287	2025-04-26 22:04:23.317695+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
288	2025-04-27 15:00:04.915887+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
289	2025-04-27 21:35:39.181505+00	Checklist de Fechamento	Henrique	ahu	\N	\N	\N	\N
290	2025-04-27 22:03:56.313666+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
291	2025-04-28 14:59:20.558343+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
292	2025-04-28 22:01:05.783518+00	Checklist de Fechamento	Henrique	ahu	\N	\N	\N	\N
293	2025-04-28 22:03:45.803118+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
294	2025-04-29 14:53:51.149939+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
295	2025-04-29 22:06:34.72281+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
296	2025-04-30 14:56:15.738398+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
297	2025-04-30 15:05:39.665766+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
298	2025-04-30 22:05:00.716685+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
299	2025-04-30 22:15:11.68588+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
300	2025-05-01 14:47:58.269699+00	Checklist de Abertura	Henrique	ahu	\N	\N	\N	\N
301	2025-05-01 15:00:47.543046+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
302	2025-05-01 22:08:27.238371+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
303	2025-05-02 14:59:55.224191+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
304	2025-05-02 15:40:23.106075+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
305	2025-05-02 22:06:52.611033+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
306	2025-05-02 22:13:04.019179+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
307	2025-05-03 14:58:21.130129+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
308	2025-05-03 15:00:02.624787+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
309	2025-05-03 22:05:16.583394+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
310	2025-05-03 22:05:21.889285+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
311	2025-05-04 14:55:09.451549+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
312	2025-05-04 15:00:46.872471+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
313	2025-05-04 22:02:26.749075+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
314	2025-05-04 22:12:28.174295+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
315	2025-05-05 14:57:05.223823+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
316	2025-05-05 14:58:53.935776+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
317	2025-05-05 22:04:41.18516+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
318	2025-05-05 22:11:31.227487+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
319	2025-05-06 14:40:36.396416+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
320	2025-05-06 22:11:00.539958+00	Checklist de Fechamento	Sthefani	altoxv	\N	\N	\N	\N
321	2025-05-06 22:22:29.2776+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
322	2025-05-07 14:58:59.14685+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
323	2025-05-07 15:01:12.331129+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
324	2025-05-07 22:04:17.497618+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
325	2025-05-07 22:15:21.499746+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
326	2025-05-08 14:56:42.59875+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
327	2025-05-08 14:58:03.433611+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
328	2025-05-08 22:04:39.239211+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
329	2025-05-08 22:08:38.799571+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
330	2025-05-09 14:56:22.369059+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
331	2025-05-09 15:00:17.279591+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
332	2025-05-09 22:03:43.048061+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
333	2025-05-09 22:06:46.984665+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
334	2025-05-10 14:41:40.603289+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
335	2025-05-10 15:00:47.717027+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
336	2025-05-10 22:03:18.243139+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
337	2025-05-10 22:05:00.7869+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
338	2025-05-11 14:52:05.628836+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
339	2025-05-11 15:00:23.889011+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
340	2025-05-11 22:00:02.813525+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
341	2025-05-11 22:04:28.221221+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
342	2025-05-12 14:55:41.78157+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
343	2025-05-12 15:02:42.43251+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
344	2025-05-12 22:04:35.63619+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
345	2025-05-12 22:05:16.555974+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
346	2025-05-13 14:45:04.369235+00	Checklist de Abertura	Sthefani	altoxv	\N	\N	\N	\N
347	2025-05-13 14:48:24.388979+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
348	2025-05-13 22:04:57.939145+00	Checklist de Fechamento	Sthefani	altoxv	\N	\N	\N	\N
349	2025-05-13 22:08:19.484642+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
350	2025-05-14 14:44:33.690974+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
351	2025-05-14 14:52:37.702534+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
352	2025-05-14 22:04:21.824918+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
353	2025-05-14 22:05:11.988304+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
354	2025-05-15 14:37:55.900392+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
355	2025-05-15 14:54:24.674381+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
356	2025-05-15 22:04:22.903654+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
357	2025-05-15 22:06:26.352653+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
358	2025-05-16 14:54:38.318505+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
359	2025-05-16 15:07:44.654811+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
360	2025-05-16 22:03:57.989499+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
361	2025-05-16 22:04:10.082735+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
362	2025-05-17 14:55:41.921503+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
363	2025-05-17 15:02:21.881026+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
364	2025-05-17 22:03:05.906469+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
365	2025-05-17 22:03:12.980644+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
366	2025-05-18 14:41:43.062099+00	Checklist de Abertura	Henrique	altoxv	\N	\N	\N	\N
367	2025-05-18 14:56:52.095871+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
368	2025-05-18 21:57:21.796385+00	Checklist de Fechamento	Marina	altoxv	\N	\N	\N	\N
369	2025-05-18 22:07:40.295382+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
370	2025-05-19 14:58:25.731725+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
371	2025-05-19 15:01:03.155267+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
372	2025-05-19 22:03:09.403443+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
373	2025-05-19 22:07:32.064639+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
374	2025-05-20 15:00:43.258669+00	Checklist de Abertura	Sthefani	altoxv	\N	\N	\N	\N
375	2025-05-20 22:07:45.395471+00	Checklist de Fechamento	Sthefani	altoxv	\N	\N	\N	\N
376	2025-05-21 14:56:55.351093+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
377	2025-05-21 22:04:15.630933+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
378	2025-05-22 14:52:41.020929+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
379	2025-05-22 14:59:45.521244+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
380	2025-05-22 21:36:55.425022+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
381	2025-05-22 22:02:36.734012+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
382	2025-05-23 14:33:50.886273+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
383	2025-05-23 14:54:56.063512+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
384	2025-05-23 22:03:35.026233+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
385	2025-05-23 22:04:37.426375+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
386	2025-05-24 14:53:17.460922+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
387	2025-05-24 14:53:22.692036+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
388	2025-05-24 22:04:51.736919+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
389	2025-05-24 22:05:22.125739+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
390	2025-05-25 14:58:33.67102+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
391	2025-05-25 15:08:32.161612+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
392	2025-05-25 22:03:40.535055+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
393	2025-05-25 22:04:18.283739+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
394	2025-05-26 14:56:54.14405+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
395	2025-05-26 15:01:21.55543+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
396	2025-05-26 22:03:52.706926+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
397	2025-05-26 22:05:07.843882+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
398	2025-05-27 14:50:13.633408+00	Checklist de Abertura	Henrique	ahu	\N	\N	\N	\N
399	2025-05-27 15:00:24.032767+00	Checklist de Abertura	Sthefani	altoxv	\N	\N	\N	\N
400	2025-05-27 22:06:05.853897+00	Checklist de Fechamento	Sthefani	altoxv	\N	\N	\N	\N
401	2025-05-27 22:06:21.476563+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
402	2025-05-28 14:59:29.483398+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
403	2025-05-28 22:05:38.465869+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
404	2025-05-28 22:06:38.922255+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
405	2025-05-28 22:06:45.050672+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
406	2025-05-29 14:55:28.769829+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
407	2025-05-29 15:02:28.87989+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
408	2025-05-29 22:04:47.220337+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
409	2025-05-29 22:05:20.418023+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
410	2025-05-30 14:56:13.376526+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
411	2025-05-30 14:57:19.185462+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
412	2025-05-30 22:04:15.11176+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
413	2025-05-30 22:05:46.785492+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
414	2025-05-31 14:41:19.06347+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
415	2025-05-31 14:50:18.552153+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
416	2025-05-31 22:02:54.668889+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
417	2025-05-31 22:03:03.097632+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
418	2025-06-01 14:48:57.542985+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
419	2025-06-01 14:58:28.491907+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
420	2025-06-01 22:03:44.610141+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
421	2025-06-01 22:06:15.490711+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
422	2025-06-02 14:58:06.560754+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
423	2025-06-02 14:59:28.032843+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
424	2025-06-02 22:00:07.125057+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
425	2025-06-02 22:10:28.861038+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
426	2025-06-03 15:00:36.562428+00	Checklist de Abertura	Sthefani	altoxv	\N	\N	\N	\N
427	2025-06-03 15:00:36.826914+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
428	2025-06-03 22:04:51.872756+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
429	2025-06-03 22:06:11.791896+00	Checklist de Fechamento	Sthefani	altoxv	\N	\N	\N	\N
430	2025-06-04 14:58:03.02481+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
431	2025-06-04 14:58:29.676271+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
432	2025-06-04 22:04:07.204643+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
433	2025-06-04 22:05:00.425233+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
434	2025-06-05 14:55:11.198668+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
435	2025-06-05 21:14:46.303565+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
436	2025-06-06 14:52:52.38235+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
437	2025-06-06 14:56:43.542009+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
438	2025-06-06 22:02:32.799796+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
439	2025-06-06 22:03:54.785929+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
440	2025-06-07 14:59:30.747328+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
441	2025-06-07 22:04:19.122644+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
442	2025-06-08 14:56:29.64363+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
443	2025-06-08 21:48:17.169863+00	Checklist de Fechamento	Henrique	ahu	\N	\N	\N	\N
444	2025-06-08 21:53:41.669649+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
445	2025-06-09 15:00:48.855685+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
446	2025-06-09 15:02:41.215126+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
447	2025-06-09 21:32:14.501569+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
448	2025-06-09 21:35:27.559134+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
449	2025-06-10 15:03:58.821727+00	Checklist de Abertura	Sthefani	altoxv	\N	\N	\N	\N
450	2025-06-10 15:11:42.70447+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
451	2025-06-10 22:03:57.040054+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
452	2025-06-10 22:05:54.894538+00	Checklist de Fechamento	Sthefani	altoxv	\N	\N	\N	\N
453	2025-06-11 14:47:01.494536+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
454	2025-06-11 14:59:42.80816+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
455	2025-06-11 22:00:35.497701+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
456	2025-06-11 22:03:51.237886+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
457	2025-06-12 14:53:08.032187+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
458	2025-06-12 15:00:44.020151+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
459	2025-06-12 22:05:08.590135+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
460	2025-06-12 22:07:47.116527+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
461	2025-06-13 14:59:03.530832+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
462	2025-06-13 14:59:51.844721+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
463	2025-06-13 22:01:36.179421+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
464	2025-06-13 22:05:36.857764+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
465	2025-06-14 14:39:57.891132+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
466	2025-06-14 15:02:56.659387+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
467	2025-06-14 22:04:46.927995+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
468	2025-06-14 22:05:15.947811+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
469	2025-06-15 14:49:41.278385+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
470	2025-06-15 14:56:45.288017+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
471	2025-06-15 22:03:40.429058+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
472	2025-06-15 22:05:53.678421+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
473	2025-06-16 14:58:31.668565+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
474	2025-06-16 14:58:49.401645+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
475	2025-06-16 22:02:04.887969+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
476	2025-06-16 22:05:17.967296+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
477	2025-06-17 15:03:11.619943+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
478	2025-06-17 15:07:07.57454+00	Checklist de Abertura	Sthefani	altoxv	\N	\N	\N	\N
479	2025-06-17 22:04:31.352161+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
480	2025-06-17 22:09:52.504854+00	Checklist de Fechamento	Sthefani	altoxv	\N	\N	\N	\N
481	2025-06-18 14:48:18.624142+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
482	2025-06-18 15:01:30.95186+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
483	2025-06-18 22:07:11.787314+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
484	2025-06-19 14:41:00.019093+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
485	2025-06-19 15:06:27.842534+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
486	2025-06-19 22:04:06.00069+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
487	2025-06-19 22:05:28.605019+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
488	2025-06-20 14:56:12.188144+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
489	2025-06-20 14:59:03.15808+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
490	2025-06-20 22:01:17.368837+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
491	2025-06-20 22:16:47.222173+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
492	2025-06-21 14:35:13.857771+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
493	2025-06-21 15:03:55.781046+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
494	2025-06-21 22:02:56.191208+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
495	2025-06-21 22:04:43.531216+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
496	2025-06-22 14:52:37.614562+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
497	2025-06-22 15:08:39.256478+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
498	2025-06-22 22:06:48.350912+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
499	2025-06-22 22:10:28.698574+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
500	2025-06-23 14:51:11.257219+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
501	2025-06-23 14:53:05.405634+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
502	2025-06-23 22:00:27.594335+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
503	2025-06-23 22:03:38.752515+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
504	2025-06-24 14:58:56.098833+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
505	2025-06-24 21:40:52.705926+00	Checklist de Fechamento	Henrique	altoxv	\N	\N	\N	\N
506	2025-06-24 22:00:07.761195+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
507	2025-06-25 14:33:08.303786+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
508	2025-06-25 14:59:12.328901+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
509	2025-06-25 22:01:06.505735+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
510	2025-06-25 22:04:46.470085+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
511	2025-06-26 14:41:32.168511+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
512	2025-06-26 14:51:46.477143+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
513	2025-06-26 21:34:24.533895+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
514	2025-06-26 21:36:16.791665+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
515	2025-06-27 14:56:43.738036+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
516	2025-06-27 14:57:00.294111+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
517	2025-06-27 22:02:35.859043+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
518	2025-06-27 22:05:06.596188+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
519	2025-06-28 14:55:36.018045+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
520	2025-06-28 18:19:43.088712+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
521	2025-06-28 22:00:57.007677+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
522	2025-06-28 22:03:37.149578+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
523	2025-06-29 14:59:42.584325+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
524	2025-06-29 22:02:58.852826+00	Checklist de Fechamento	Henrique	altoxv	\N	\N	\N	\N
525	2025-06-29 22:04:54.141048+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
526	2025-06-30 14:35:44.880452+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
527	2025-06-30 14:59:11.777151+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
528	2025-06-30 21:59:17.157723+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
529	2025-06-30 22:03:11.221307+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
530	2025-07-01 15:00:29.507824+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
531	2025-07-01 21:59:46.743774+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
532	2025-07-02 14:38:49.70049+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
533	2025-07-02 21:20:24.359295+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
534	2025-07-02 22:04:31.605111+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
535	2025-07-02 22:07:57.496046+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
536	2025-07-03 14:28:04.831293+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
537	2025-07-03 14:57:06.073985+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
538	2025-07-03 22:02:24.552159+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
539	2025-07-03 22:03:05.559917+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
540	2025-07-04 14:55:30.962171+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
541	2025-07-04 14:56:21.762734+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
542	2025-07-04 22:00:59.371683+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
543	2025-07-04 22:04:31.088353+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
544	2025-07-05 14:42:27.703229+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
545	2025-07-05 14:57:52.692532+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
546	2025-07-05 22:00:20.143758+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
547	2025-07-05 22:03:02.786805+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
548	2025-07-06 14:59:20.813558+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
549	2025-07-06 15:11:11.706773+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
550	2025-07-06 22:04:12.355908+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
551	2025-07-06 22:04:15.935039+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
552	2025-07-07 14:43:25.044787+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
553	2025-07-07 15:08:36.942981+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
554	2025-07-07 22:00:50.423561+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
555	2025-07-07 22:03:04.109555+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
556	2025-07-08 15:05:11.427699+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
557	2025-07-08 22:00:13.514566+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
558	2025-07-09 14:33:42.614183+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
559	2025-07-09 15:02:02.533271+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
560	2025-07-09 22:04:35.788697+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
561	2025-07-09 22:07:07.797424+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
562	2025-07-10 14:29:06.196036+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
563	2025-07-10 14:58:07.355802+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
564	2025-07-10 22:03:20.457663+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
565	2025-07-10 22:04:31.262743+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
566	2025-07-11 14:52:36.898221+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
567	2025-07-11 14:59:41.053686+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
568	2025-07-11 22:01:19.796426+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
569	2025-07-11 22:07:35.95191+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
570	2025-07-12 14:33:57.000109+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
571	2025-07-12 15:03:34.530895+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
572	2025-07-12 22:03:07.593279+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
573	2025-07-12 22:05:15.248186+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
574	2025-07-13 14:33:39.548661+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
575	2025-07-13 15:01:18.630831+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
576	2025-07-13 22:01:36.432703+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
577	2025-07-13 22:02:12.526244+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
578	2025-07-14 14:34:33.317733+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
579	2025-07-14 15:07:35.309853+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
580	2025-07-14 22:04:01.556157+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
581	2025-07-14 22:04:10.726448+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
582	2025-07-15 14:57:04.588214+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
583	2025-07-15 22:19:23.777081+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
584	2025-07-16 14:37:57.503704+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
585	2025-07-16 14:55:18.326844+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
586	2025-07-16 22:02:05.515922+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
587	2025-07-16 22:07:28.164039+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
588	2025-07-17 14:33:30.472871+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
589	2025-07-17 22:02:33.339145+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
590	2025-07-17 22:05:14.333592+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
591	2025-07-18 14:46:37.175104+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
592	2025-07-18 21:50:26.593708+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
593	2025-07-18 22:01:10.741772+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
594	2025-07-18 22:06:39.487477+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
595	2025-07-19 14:30:32.31096+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
596	2025-07-19 14:59:50.830499+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
597	2025-07-19 22:02:40.011633+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
598	2025-07-19 22:09:52.817871+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
599	2025-07-20 14:46:44.51585+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
600	2025-07-20 14:53:37.255168+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
601	2025-07-20 22:02:57.769463+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
602	2025-07-20 22:04:35.625566+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
603	2025-07-21 14:34:31.613256+00	Checklist de Abertura	Henrique	altoxv	\N	\N	\N	\N
604	2025-07-21 15:08:29.667291+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
605	2025-07-21 22:02:49.870057+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
606	2025-07-21 22:03:06.932102+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
607	2025-07-22 15:00:52.396279+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
608	2025-07-22 22:13:58.495451+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
609	2025-07-23 14:47:39.710434+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
610	2025-07-23 14:59:23.402708+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
611	2025-07-23 22:04:28.260199+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
612	2025-07-23 22:15:30.56327+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
613	2025-07-24 14:36:22.658805+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
614	2025-07-24 15:01:40.865493+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
615	2025-07-24 22:03:24.671629+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
616	2025-07-24 22:03:52.707545+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
617	2025-07-25 14:48:34.52714+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
618	2025-07-25 14:59:02.499878+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
619	2025-07-25 22:04:47.101797+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
620	2025-07-25 22:05:42.367922+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
621	2025-07-26 14:54:33.720232+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
622	2025-07-26 15:01:09.75519+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
623	2025-07-26 22:02:56.474339+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
624	2025-07-26 22:03:29.784954+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
625	2025-07-27 14:59:12.156556+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
626	2025-07-27 17:38:27.606789+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
627	2025-07-27 21:53:17.347034+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
628	2025-07-27 22:13:30.754648+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
629	2025-07-28 14:45:42.127219+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
630	2025-07-28 15:19:13.982578+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
631	2025-07-28 22:02:34.551384+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
632	2025-07-28 22:03:51.993506+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
633	2025-07-29 14:39:22.669805+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
634	2025-07-29 14:59:23.761801+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
635	2025-07-29 22:01:34.59531+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
636	2025-07-29 22:03:27.546138+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
637	2025-07-30 14:52:55.407878+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
638	2025-07-30 15:59:33.29031+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
639	2025-07-30 22:04:41.403595+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
640	2025-07-31 14:32:05.023195+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
641	2025-07-31 14:57:47.407233+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
642	2025-07-31 22:04:14.784603+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
643	2025-07-31 22:04:28.232575+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
644	2025-08-01 14:50:43.345495+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
645	2025-08-01 14:58:22.574934+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
646	2025-08-01 22:05:38.802556+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
647	2025-08-01 22:05:59.454226+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
648	2025-08-02 14:31:11.23275+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
649	2025-08-02 15:00:32.428882+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
650	2025-08-02 22:03:34.136489+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
651	2025-08-02 22:15:51.001848+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
652	2025-08-03 14:43:42.03786+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
653	2025-08-03 15:06:53.363855+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
654	2025-08-03 22:03:39.055463+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
655	2025-08-03 22:03:49.500015+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
656	2025-08-04 14:50:52.436865+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
657	2025-08-04 15:01:58.51406+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
658	2025-08-04 22:03:08.095091+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
659	2025-08-04 22:07:06.089879+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
660	2025-08-05 15:07:10.064052+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
661	2025-08-05 15:33:16.456602+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
662	2025-08-05 22:05:53.597689+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
663	2025-08-06 14:40:11.12108+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
664	2025-08-06 14:59:26.168833+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
665	2025-08-06 22:03:52.06204+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
666	2025-08-06 22:04:52.401594+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
667	2025-08-07 14:36:53.673593+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
668	2025-08-07 14:58:35.056551+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
669	2025-08-07 22:02:46.456517+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
670	2025-08-07 22:09:35.59541+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
671	2025-08-08 14:44:15.528566+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
672	2025-08-08 15:01:24.527201+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
673	2025-08-08 22:03:34.102021+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
674	2025-08-08 22:04:52.478096+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
675	2025-08-09 14:26:28.929947+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
676	2025-08-09 14:59:24.821768+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
677	2025-08-09 22:03:08.507154+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
678	2025-08-09 22:04:14.943278+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
679	2025-08-10 14:50:18.053303+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
680	2025-08-10 15:01:54.157612+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
681	2025-08-10 22:02:25.111377+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
682	2025-08-10 22:14:12.873204+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
683	2025-08-11 14:50:39.683692+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
684	2025-08-11 15:01:53.678383+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
685	2025-08-11 21:59:22.656996+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
686	2025-08-11 22:03:48.330749+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
687	2025-08-12 15:06:36.020038+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
688	2025-08-12 21:37:21.352623+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
689	2025-08-12 22:02:30.552543+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
690	2025-08-12 22:03:11.294611+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
691	2025-08-13 14:52:28.221923+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
692	2025-08-13 15:01:31.342655+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
693	2025-08-13 22:05:01.561328+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
694	2025-08-13 22:07:48.63986+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
695	2025-08-14 14:49:08.628926+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
696	2025-08-14 14:56:26.547529+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
697	2025-08-14 22:05:03.252987+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
698	2025-08-14 22:06:17.423951+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
699	2025-08-15 14:54:16.04541+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
700	2025-08-15 21:59:51.380366+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
701	2025-08-15 22:04:37.013442+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
702	2025-08-16 14:36:13.849939+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
703	2025-08-16 15:00:08.068284+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
704	2025-08-16 22:04:16.098895+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
705	2025-08-16 22:21:11.360689+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
706	2025-08-17 14:47:38.04617+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
707	2025-08-17 15:00:09.611612+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
708	2025-08-17 22:06:42.201385+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
709	2025-08-17 22:26:06.718212+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
710	2025-08-18 14:41:50.872701+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
711	2025-08-18 14:59:40.812952+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
712	2025-08-18 22:02:17.819634+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
713	2025-08-18 22:13:34.945044+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
714	2025-08-19 14:44:09.529973+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
715	2025-08-19 15:00:08.927804+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
716	2025-08-19 22:03:12.473021+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
717	2025-08-19 22:13:29.582827+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
718	2025-08-20 14:49:54.148639+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
719	2025-08-20 15:00:08.963439+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
720	2025-08-20 22:02:37.92763+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
721	2025-08-20 22:03:19.100522+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
722	2025-08-21 14:38:10.022553+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
723	2025-08-21 15:00:28.828121+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
724	2025-08-21 22:03:31.881862+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
725	2025-08-21 22:05:34.493108+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
726	2025-08-22 14:47:39.038383+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
727	2025-08-22 15:12:01.628346+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
728	2025-08-22 22:04:00.124267+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
729	2025-08-23 14:36:31.809958+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
730	2025-08-23 15:06:36.394132+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
731	2025-08-23 22:10:46.411048+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
732	2025-08-23 22:16:38.892728+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
733	2025-08-24 14:55:44.069447+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
734	2025-08-24 15:37:59.750886+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
735	2025-08-24 22:01:50.825402+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
736	2025-08-24 22:02:28.176989+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
737	2025-08-25 14:42:29.500163+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
738	2025-08-25 15:03:32.907963+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
739	2025-08-25 22:02:03.527544+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
740	2025-08-25 22:04:09.114639+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
741	2025-08-26 14:48:55.589812+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
742	2025-08-26 15:08:23.643644+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
743	2025-08-26 22:00:52.020935+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
744	2025-08-26 22:03:42.266742+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
745	2025-08-27 14:36:53.145762+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
746	2025-08-27 15:01:31.264429+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
747	2025-08-27 22:02:54.888216+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
748	2025-08-27 22:06:15.555667+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
749	2025-08-28 14:44:47.765534+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
750	2025-08-28 14:58:16.179191+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
751	2025-08-28 22:02:51.19767+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
752	2025-08-28 22:05:33.654668+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
753	2025-08-29 14:43:04.310763+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
754	2025-08-29 14:58:08.049969+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
755	2025-08-29 22:03:39.048657+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
756	2025-08-29 22:03:52.68538+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
757	2025-08-30 14:39:20.709359+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
758	2025-08-30 15:00:24.374845+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
759	2025-08-30 22:03:53.198328+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
760	2025-08-30 22:09:21.265291+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
761	2025-08-31 14:46:03.43276+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
762	2025-08-31 14:59:11.75299+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
763	2025-08-31 22:02:07.522029+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
764	2025-08-31 22:13:23.557446+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
765	2025-09-01 14:41:25.113077+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
766	2025-09-01 14:59:26.199733+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
767	2025-09-01 22:02:25.342599+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
768	2025-09-01 22:02:47.435403+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
769	2025-09-02 15:04:57.574146+00	Checklist de Abertura	Sthefani	altoxv	\N	\N	\N	\N
770	2025-09-02 15:05:15.155736+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
771	2025-09-02 22:02:33.68155+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
772	2025-09-02 22:03:28.89294+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
773	2025-09-03 14:46:33.779014+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
774	2025-09-03 15:05:17.012195+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
775	2025-09-03 22:04:08.266028+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
776	2025-09-03 22:38:22.250369+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
777	2025-09-04 14:44:42.165735+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
778	2025-09-04 15:00:14.678946+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
779	2025-09-04 22:03:46.701972+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
780	2025-09-04 22:22:50.187686+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
781	2025-09-05 14:43:41.215883+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
782	2025-09-05 14:59:00.350419+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
783	2025-09-05 22:04:58.135589+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
784	2025-09-05 22:05:11.319271+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
785	2025-09-06 14:32:34.235046+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
786	2025-09-06 14:59:03.209242+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
787	2025-09-06 22:02:40.602944+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
788	2025-09-07 14:44:53.351847+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
789	2025-09-07 14:48:01.747007+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
790	2025-09-07 22:03:31.300348+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
791	2025-09-07 22:04:47.929318+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
792	2025-09-08 15:07:51.219999+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
793	2025-09-08 22:02:31.168644+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
794	2025-09-08 22:36:55.321661+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
795	2025-09-09 14:33:14.239202+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
796	2025-09-09 15:03:47.112616+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
797	2025-09-09 22:02:24.163992+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
798	2025-09-09 22:07:09.686998+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
799	2025-09-10 14:43:55.947936+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
800	2025-09-10 15:04:58.110422+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
801	2025-09-10 22:05:06.256151+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
802	2025-09-10 22:52:54.661036+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
803	2025-09-11 14:56:05.454006+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
804	2025-09-11 14:59:12.306193+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
805	2025-09-11 22:00:38.61233+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
806	2025-09-11 22:03:37.75225+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
807	2025-09-12 14:54:27.982138+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
808	2025-09-12 14:57:34.24936+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
809	2025-09-12 22:04:24.857584+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
810	2025-09-12 22:13:45.366734+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
811	2025-09-12 22:25:46.801838+00	Checklist de Fechamento	Henrique	altoxv	\N	\N	\N	\N
812	2025-09-13 14:48:36.636094+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
813	2025-09-13 14:59:03.84492+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
814	2025-09-13 22:02:38.509555+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
815	2025-09-13 22:04:29.849188+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
816	2025-09-14 14:59:46.005039+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
817	2025-09-14 15:00:07.489632+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
818	2025-09-14 22:13:00.075846+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
819	2025-09-14 22:17:58.802675+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
820	2025-09-15 14:52:20.663513+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
821	2025-09-15 15:19:43.151423+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
822	2025-09-15 16:18:36.810807+00	Checklist de Fechamento		ahu	\N	\N	\N	\N
823	2025-09-15 16:20:00.952701+00	Checklist de Fechamento	Henrique	ahu	\N	\N	\N	\N
824	2025-09-15 16:20:19.706694+00	Checklist de Abertura		ahu	\N	\N	\N	\N
825	2025-09-15 16:20:26.975135+00	Checklist de Fechamento		ahu	\N	\N	\N	\N
826	2025-09-15 22:02:23.063899+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
827	2025-09-15 22:08:19.683206+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
828	2025-09-16 14:43:30.690817+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
829	2025-09-16 15:04:13.930007+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
830	2025-09-16 22:03:15.853581+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
831	2025-09-16 22:15:51.708424+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
832	2025-09-17 14:46:15.109059+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
833	2025-09-17 22:13:21.602145+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
834	2025-09-18 14:40:22.263686+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
835	2025-09-18 14:58:40.639488+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
836	2025-09-18 22:02:57.35529+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
837	2025-09-18 22:16:11.563781+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
838	2025-09-19 14:51:26.557555+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
839	2025-09-19 15:07:25.209878+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
840	2025-09-19 22:04:22.461032+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
841	2025-09-19 22:05:03.030008+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
842	2025-09-20 14:38:06.388933+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
843	2025-09-20 15:53:01.949118+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
844	2025-09-20 22:06:49.535702+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
845	2025-09-20 22:44:31.580387+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
846	2025-09-21 14:40:17.2433+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
847	2025-09-21 15:37:53.498961+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
848	2025-09-21 22:05:40.628535+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
849	2025-09-21 22:07:29.057305+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
850	2025-09-22 14:37:33.062659+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
851	2025-09-22 14:55:34.49073+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
852	2025-09-22 22:01:30.550379+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
853	2025-09-22 22:01:34.905741+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
854	2025-09-23 14:50:02.578257+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
855	2025-09-23 22:01:48.787322+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
856	2025-09-23 22:06:49.655203+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
857	2025-09-24 14:48:13.678714+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
858	2025-09-24 15:11:02.979051+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
859	2025-09-24 22:04:56.196347+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
860	2025-09-24 22:07:07.099253+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
861	2025-09-25 14:59:52.580455+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
862	2025-09-25 22:04:57.748573+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
863	2025-09-26 14:47:44.47057+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
864	2025-09-26 15:04:06.867944+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
865	2025-09-26 22:04:38.581048+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
866	2025-09-26 22:05:47.4662+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
867	2025-09-27 14:29:39.491979+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
868	2025-09-27 15:00:38.601502+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
869	2025-09-27 22:01:54.281113+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
870	2025-09-27 22:20:49.841+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
871	2025-09-28 15:00:35.07877+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
872	2025-09-28 15:01:07.401552+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
873	2025-09-28 22:04:10.734176+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
874	2025-09-28 22:18:29.77993+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
875	2025-09-29 14:41:46.253082+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
876	2025-09-29 15:09:26.863461+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
877	2025-09-29 22:04:06.245107+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
878	2025-09-29 22:05:55.995484+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
879	2025-09-30 15:07:36.018736+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
880	2025-09-30 15:15:18.595329+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
881	2025-09-30 22:01:45.53042+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
882	2025-09-30 22:02:03.608983+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
883	2025-10-01 14:42:43.915956+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
884	2025-10-01 15:01:53.712512+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
885	2025-10-01 22:03:10.930415+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
886	2025-10-01 22:04:01.050567+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
887	2025-10-02 14:54:53.413418+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
888	2025-10-02 14:59:11.206458+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
889	2025-10-02 22:02:49.624724+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
890	2025-10-02 22:03:10.142808+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
891	2025-10-03 14:46:53.300872+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
892	2025-10-03 14:53:07.889412+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
893	2025-10-03 22:01:47.706755+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
894	2025-10-03 22:02:54.191154+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
895	2025-10-04 14:41:51.936689+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
896	2025-10-04 14:58:45.248169+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
897	2025-10-04 22:03:26.942475+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
898	2025-10-04 22:04:15.691928+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
899	2025-10-05 14:51:51.008857+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
900	2025-10-05 15:52:36.314328+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
901	2025-10-05 22:02:56.219928+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
902	2025-10-05 22:25:30.026889+00	Checklist de Fechamento		ahu	\N	\N	\N	\N
903	2025-10-06 14:52:33.023966+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
904	2025-10-06 16:38:20.056952+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
905	2025-10-06 22:04:24.801852+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
906	2025-10-06 22:05:21.6538+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
907	2025-10-07 14:37:32.697195+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
908	2025-10-07 15:29:40.715489+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
909	2025-10-07 20:55:56.205688+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
910	2025-10-07 21:59:38.497009+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
911	2025-10-08 15:00:13.264436+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
912	2025-10-08 15:18:17.525858+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
913	2025-10-08 22:00:44.019923+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
914	2025-10-09 14:32:52.428872+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
915	2025-10-09 15:24:32.426384+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
916	2025-10-09 22:00:52.712989+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
917	2025-10-09 22:03:53.163474+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
918	2025-10-10 14:50:23.015345+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
919	2025-10-10 14:59:16.270768+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
920	2025-10-10 22:03:49.092954+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
921	2025-10-10 22:04:12.384044+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
922	2025-10-11 14:41:17.785497+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
923	2025-10-11 21:09:04.02284+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
924	2025-10-11 22:01:33.685016+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
925	2025-10-11 22:06:38.187308+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
926	2025-10-12 15:01:34.930349+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
927	2025-10-12 22:01:51.076833+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
928	2025-10-13 14:59:12.641184+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
929	2025-10-13 15:02:21.559159+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
930	2025-10-13 22:02:46.819846+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
931	2025-10-13 22:03:44.48417+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
932	2025-10-14 14:49:50.650106+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
933	2025-10-14 14:58:51.529744+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
934	2025-10-14 22:01:57.187362+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
935	2025-10-14 22:06:10.599169+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
936	2025-10-15 14:47:09.328796+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
937	2025-10-15 15:02:40.773043+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
938	2025-10-15 21:58:31.808928+00	Checklist de Fechamento	Henrique	altoxv	\N	\N	\N	\N
939	2025-10-15 22:05:49.415528+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
940	2025-10-16 14:44:39.423319+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
941	2025-10-16 15:07:51.372711+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
942	2025-10-16 22:01:35.296108+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
943	2025-10-16 22:03:02.137149+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
944	2025-10-17 12:18:33.255574+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
945	2025-10-17 14:51:25.64421+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
946	2025-10-17 14:58:50.274102+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
947	2025-10-17 15:01:55.430584+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
948	2025-10-17 20:34:27.138576+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
949	2025-10-17 22:02:56.342116+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
950	2025-10-17 22:03:07.191662+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
951	2025-10-18 14:49:35.521713+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
952	2025-10-18 14:59:16.77387+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
953	2025-10-18 14:59:20.569105+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
954	2025-10-18 20:34:21.172376+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
955	2025-10-18 22:00:46.594626+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
956	2025-10-18 22:01:37.748404+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
957	2025-10-19 14:55:48.537642+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
958	2025-10-19 15:00:45.313511+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
959	2025-10-19 22:02:43.296863+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
960	2025-10-19 22:03:21.967937+00	Checklist de Fechamento	Henrique	ahu	\N	\N	\N	\N
961	2025-10-20 14:49:25.424834+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
962	2025-10-20 14:52:36.004421+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
963	2025-10-20 15:01:23.21222+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
964	2025-10-20 20:37:56.493087+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
965	2025-10-20 22:03:55.892277+00	Checklist de Fechamento	Daniela	altoxv	\N	\N	\N	\N
966	2025-10-20 22:03:57.535939+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
967	2025-10-21 14:38:03.90532+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
968	2025-10-21 14:47:18.794491+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
969	2025-10-21 14:58:34.887116+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
970	2025-10-21 20:36:24.928826+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
971	2025-10-21 22:01:56.516094+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
972	2025-10-21 22:02:24.196266+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
973	2025-10-22 14:17:52.555937+00	Checklist de Abertura		ahu	\N	\N	\N	\N
974	2025-10-22 14:42:17.752599+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
975	2025-10-22 14:50:34.957609+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
976	2025-10-22 20:29:45.609494+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
977	2025-10-22 21:56:31.092839+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
978	2025-10-22 22:22:14.927243+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
979	2025-10-23 14:34:09.836552+00	Checklist de Abertura	Daniela	altoxv	\N	\N	\N	\N
980	2025-10-23 14:44:39.782227+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
981	2025-10-23 14:57:42.264258+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
982	2025-10-23 20:34:46.671746+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
983	2025-10-23 22:03:11.382635+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
984	2025-10-23 22:04:32.68392+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
985	2025-10-24 14:59:12.135581+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
986	2025-10-24 15:00:07.960249+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
987	2025-10-24 15:15:57.644091+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
988	2025-10-24 20:21:59.347852+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
989	2025-10-24 22:07:11.625427+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
990	2025-10-24 22:24:54.715515+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
991	2025-10-25 14:46:49.855072+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
992	2025-10-25 15:01:21.79357+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
993	2025-10-25 15:01:30.279001+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
994	2025-10-25 20:32:09.275068+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
995	2025-10-25 22:08:32.126201+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
996	2025-10-25 22:25:56.098388+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
997	2025-10-26 15:05:30.115001+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
998	2025-10-26 15:36:07.265681+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
999	2025-10-26 22:05:11.904794+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1000	2025-10-26 22:12:57.29549+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1001	2025-10-27 14:54:16.85041+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
1002	2025-10-27 14:58:58.979357+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1003	2025-10-27 16:15:49.080819+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1004	2025-10-27 20:29:41.36447+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
1005	2025-10-27 22:01:43.64693+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1006	2025-10-27 22:01:49.691858+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1007	2025-10-28 14:41:00.631271+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1008	2025-10-28 14:47:48.947024+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
1009	2025-10-28 15:02:03.286463+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1010	2025-10-28 20:28:37.197675+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
1011	2025-10-28 22:01:20.03529+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1012	2025-10-28 22:02:32.823622+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1013	2025-10-29 14:55:05.694934+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1014	2025-10-29 15:00:22.475547+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1015	2025-10-29 16:07:47.144841+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
1016	2025-10-29 20:31:06.286032+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
1017	2025-10-29 22:00:59.126848+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1018	2025-10-29 22:07:14.500988+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1019	2025-10-30 14:51:29.561628+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
1020	2025-10-30 15:03:08.571277+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1021	2025-10-30 20:22:57.182642+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1022	2025-10-30 20:34:53.765714+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
1023	2025-10-30 22:00:52.06688+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1024	2025-10-30 22:04:02.992936+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1025	2025-10-31 14:45:59.488655+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
1026	2025-10-31 15:00:04.55956+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1027	2025-10-31 20:27:25.529536+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
1028	2025-10-31 22:02:24.100845+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1029	2025-10-31 22:11:25.889875+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
1030	2025-11-01 14:47:07.018159+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1031	2025-11-01 14:54:01.851373+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
1032	2025-11-01 14:59:25.059969+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1033	2025-11-01 20:24:03.637349+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
1034	2025-11-01 22:01:13.60646+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1035	2025-11-01 22:03:48.597166+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1036	2025-11-02 14:45:13.718553+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1037	2025-11-02 14:58:27.227755+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1038	2025-11-02 22:01:02.812068+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1039	2025-11-02 22:02:03.098161+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1040	2025-11-03 14:23:39.998535+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
1041	2025-11-03 14:41:02.317134+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1042	2025-11-03 15:01:01.110303+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1043	2025-11-03 20:25:53.50752+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
1044	2025-11-03 21:59:07.989643+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1045	2025-11-03 22:00:32.242695+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1046	2025-11-04 14:43:07.10646+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
1047	2025-11-04 14:44:43.754581+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1048	2025-11-04 15:00:00.514317+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1049	2025-11-04 20:40:14.47701+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
1050	2025-11-04 22:00:47.56989+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1051	2025-11-04 22:15:05.697692+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1052	2025-11-05 14:43:53.782781+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1053	2025-11-05 14:50:41.04877+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
1054	2025-11-05 20:19:32.444861+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
1055	2025-11-05 22:10:29.696171+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1056	2025-11-06 14:44:34.764542+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1057	2025-11-06 14:52:14.226979+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
1058	2025-11-06 15:24:18.461115+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1059	2025-11-06 20:25:37.910864+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
1060	2025-11-06 22:00:38.484633+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1061	2025-11-06 22:00:54.22363+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1062	2025-11-07 15:00:49.26957+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1063	2025-11-07 15:12:41.050904+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
1064	2025-11-07 22:14:05.105817+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
1065	2025-11-07 22:24:00.222614+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1066	2025-11-08 14:44:30.00769+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1067	2025-11-08 16:18:25.969097+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1068	2025-11-08 22:00:30.208401+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1069	2025-11-08 22:26:28.7865+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1070	2025-11-09 14:44:38.312624+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1071	2025-11-09 15:00:50.919889+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1072	2025-11-09 22:00:43.479509+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1073	2025-11-09 22:19:42.896043+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1074	2025-11-10 14:40:16.746693+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1075	2025-11-10 15:14:00.003079+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1076	2025-11-10 15:20:00.709733+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
1077	2025-11-10 20:28:06.828473+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
1078	2025-11-10 22:00:36.158109+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1079	2025-11-10 22:00:43.090537+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1080	2025-11-11 14:24:43.478261+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
1081	2025-11-11 14:37:09.975003+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1082	2025-11-11 16:34:02.336294+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1083	2025-11-11 20:31:52.619868+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
1084	2025-11-11 22:00:25.951468+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1085	2025-11-11 22:10:09.309886+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1086	2025-11-12 14:44:11.808159+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1087	2025-11-12 14:47:58.931815+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
1088	2025-11-12 15:01:43.246439+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1089	2025-11-12 20:10:14.682613+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
1090	2025-11-12 22:02:59.679251+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1091	2025-11-12 22:06:20.744089+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1092	2025-11-13 14:47:48.730633+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
1093	2025-11-13 14:54:27.659642+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1094	2025-11-13 15:44:23.870388+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1095	2025-11-13 20:13:52.749392+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
1096	2025-11-13 22:00:17.915789+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1097	2025-11-13 22:02:26.588547+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1098	2025-11-14 15:00:39.990848+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1099	2025-11-14 15:05:04.483258+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
1100	2025-11-14 22:04:21.137747+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1101	2025-11-14 22:21:05.491737+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
1102	2025-11-15 14:32:32.608947+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1103	2025-11-15 15:06:06.311977+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1104	2025-11-15 22:01:14.656845+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1105	2025-11-15 22:04:59.915142+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1106	2025-11-16 14:49:23.839661+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1107	2025-11-16 15:02:11.951659+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1108	2025-11-16 22:01:10.225721+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1109	2025-11-16 22:05:15.506106+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1110	2025-11-17 15:00:40.17462+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1111	2025-11-17 22:03:02.619163+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1112	2025-11-18 22:03:52.222358+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1113	2025-11-19 14:36:47.720235+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1114	2025-11-19 15:01:30.876608+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1115	2025-11-19 22:00:35.095988+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1116	2025-11-19 22:55:41.636972+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1117	2025-11-20 21:57:41.720574+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1118	2025-11-20 22:08:54.735634+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1119	2025-11-20 22:25:14.834013+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1120	2025-11-21 15:02:06.643429+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
1121	2025-11-21 15:09:04.111554+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1122	2025-11-21 22:32:14.851811+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1123	2025-11-22 15:17:27.675259+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1124	2025-11-22 22:02:17.579778+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1125	2025-11-23 14:58:19.192434+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1126	2025-11-23 22:04:09.2771+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1127	2025-11-24 15:02:06.757262+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1128	2025-11-24 22:02:47.314368+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1129	2025-11-24 22:03:53.002377+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1130	2025-11-25 14:58:04.658082+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1131	2025-11-25 22:10:05.566216+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1132	2025-11-26 15:06:40.60267+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1133	2025-11-26 15:13:24.684609+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1134	2025-11-26 22:19:51.376245+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1135	2025-11-26 22:37:39.568411+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1136	2025-11-27 15:05:17.38337+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1137	2025-11-27 15:22:37.932875+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1138	2025-11-27 22:07:50.396263+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1139	2025-11-27 22:11:47.167922+00	Checklist de Fechamento	Henrique	altoxv	\N	\N	\N	\N
1140	2025-11-28 15:02:34.023354+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1141	2025-11-28 20:48:53.689687+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
1142	2025-11-28 22:12:28.638854+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1143	2025-11-28 22:35:28.40563+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
1144	2025-11-29 15:02:46.751739+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1145	2025-11-29 17:15:54.078392+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1146	2025-11-29 22:26:44.379365+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1147	2025-11-30 14:54:46.122559+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1148	2025-11-30 15:19:18.624409+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1149	2025-11-30 22:02:24.244185+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1150	2025-12-01 14:44:10.462652+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1151	2025-12-01 15:03:04.764411+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1152	2025-12-01 22:00:33.377106+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1153	2025-12-01 22:04:08.539223+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1154	2025-12-02 14:45:05.533595+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1155	2025-12-02 15:02:22.912275+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1156	2025-12-02 22:01:14.960091+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1157	2025-12-02 22:09:49.236541+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1158	2025-12-03 14:38:42.72424+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1159	2025-12-03 14:53:32.408431+00	Checklist de Abertura	Henrique	batel	\N	\N	\N	\N
1160	2025-12-03 15:02:48.258016+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1161	2025-12-03 20:42:33.320581+00	Checklist de Fechamento	Luiza	batel	\N	\N	\N	\N
1162	2025-12-03 22:02:38.500321+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1163	2025-12-03 22:45:40.521001+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1164	2025-12-04 14:56:30.4644+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1165	2025-12-04 15:03:22.237903+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1166	2025-12-04 22:06:28.57711+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1167	2025-12-04 22:11:31.473814+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1168	2025-12-05 14:49:51.343823+00	Checklist de Abertura	Luiza	batel	\N	\N	\N	\N
1169	2025-12-05 15:08:01.789501+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1170	2025-12-05 15:14:01.989667+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1171	2025-12-05 22:16:01.583052+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1172	2025-12-05 22:16:50.606114+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1173	2025-12-06 14:59:09.138108+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1174	2025-12-06 15:12:32.452054+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1175	2025-12-06 15:13:12.464295+00	Checklist de Abertura	Henrique	batel	\N	\N	\N	\N
1176	2025-12-06 20:50:13.778763+00	Checklist de Fechamento	Henrique	batel	\N	\N	\N	\N
1177	2025-12-06 22:12:29.162388+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1178	2025-12-06 22:34:05.841672+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1179	2025-12-07 14:52:42.589601+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1180	2025-12-07 22:20:43.370696+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1181	2025-12-07 22:21:31.027827+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1182	2025-12-08 16:16:00.861752+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1183	2025-12-08 18:02:00.276362+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1184	2025-12-08 22:01:18.199433+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1185	2025-12-08 22:06:24.375908+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1186	2025-12-09 14:42:09.067991+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1187	2025-12-09 14:46:26.639908+00	Checklist de Abertura	Fabiana	batel	\N	\N	\N	\N
1188	2025-12-09 15:12:09.355848+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1189	2025-12-09 20:37:15.084824+00	Checklist de Fechamento	Fabiana	batel	\N	\N	\N	\N
1190	2025-12-09 22:05:03.938742+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1191	2025-12-09 22:07:14.064292+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1192	2025-12-10 14:42:38.878181+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1193	2025-12-10 15:01:09.900512+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1194	2025-12-10 15:02:42.764765+00	Checklist de Abertura	Fabiana	batel	\N	\N	\N	\N
1195	2025-12-10 20:32:59.250777+00	Checklist de Fechamento	Fabiana	batel	\N	\N	\N	\N
1196	2025-12-10 22:03:23.624868+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1197	2025-12-10 22:32:18.085776+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1198	2025-12-11 14:44:27.645778+00	Checklist de Abertura	Fabiana	batel	\N	\N	\N	\N
1199	2025-12-11 14:46:06.523176+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1200	2025-12-11 20:35:08.259732+00	Checklist de Fechamento	Fabiana	batel	\N	\N	\N	\N
1201	2025-12-11 22:00:34.445879+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1202	2025-12-11 22:09:26.027406+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1203	2025-12-12 15:09:41.855802+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1204	2025-12-12 15:12:46.656745+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1205	2025-12-12 17:30:21.542878+00	Checklist de Abertura	Fabiana	batel	\N	\N	\N	\N
1206	2025-12-12 20:38:51.223534+00	Checklist de Fechamento	Fabiana	batel	\N	\N	\N	\N
1207	2025-12-12 22:03:50.938804+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1208	2025-12-12 22:17:40.352859+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1209	2025-12-13 14:40:07.106792+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1210	2025-12-13 14:47:31.754349+00	Checklist de Abertura	Fabiana	batel	\N	\N	\N	\N
1211	2025-12-13 17:31:20.814425+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1212	2025-12-13 20:38:09.51209+00	Checklist de Fechamento	Fabiana	batel	\N	\N	\N	\N
1213	2025-12-13 22:03:51.913542+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1214	2025-12-13 22:24:20.679762+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1215	2025-12-14 14:44:43.306011+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1216	2025-12-14 15:46:58.055765+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1217	2025-12-14 22:02:02.830478+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1218	2025-12-14 22:16:55.63325+00	Checklist de Fechamento	Henrique	ahu	\N	\N	\N	\N
1219	2025-12-15 14:38:22.734012+00	Checklist de Abertura	Fabiana	batel	\N	\N	\N	\N
1220	2025-12-15 14:47:15.343196+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1221	2025-12-15 15:07:30.199727+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1222	2025-12-15 20:34:22.560051+00	Checklist de Fechamento	Fabiana	batel	\N	\N	\N	\N
1223	2025-12-15 22:00:16.168144+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1224	2025-12-15 22:20:44.449932+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1225	2025-12-16 14:47:58.706543+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1226	2025-12-16 14:59:04.054154+00	Checklist de Abertura	Fabiana	batel	\N	\N	\N	\N
1227	2025-12-16 15:10:54.355803+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1228	2025-12-16 20:39:19.731066+00	Checklist de Fechamento	Fabiana	batel	\N	\N	\N	\N
1229	2025-12-16 22:00:49.972012+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1230	2025-12-16 22:02:07.930872+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1231	2025-12-17 15:07:56.530648+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1232	2025-12-17 15:15:41.624446+00	Checklist de Abertura	Fabiana	batel	\N	\N	\N	\N
1233	2025-12-17 16:45:54.960104+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1234	2025-12-17 20:24:02.698126+00	Checklist de Fechamento	Fabiana	batel	\N	\N	\N	\N
1235	2025-12-17 21:56:45.508885+00	Checklist de Fechamento		ahu	\N	\N	\N	\N
1236	2025-12-17 22:02:13.666012+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1237	2025-12-18 14:41:31.851706+00	Checklist de Abertura	Fabiana	batel	\N	\N	\N	\N
1238	2025-12-18 14:51:18.978621+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1239	2025-12-18 15:08:10.862557+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1240	2025-12-18 20:20:31.246962+00	Checklist de Fechamento	Fabiana	batel	\N	\N	\N	\N
1241	2025-12-18 22:06:48.332255+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1242	2025-12-18 22:07:59.112305+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1243	2025-12-19 15:01:15.36014+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1244	2025-12-19 15:12:58.136497+00	Checklist de Abertura	Fabiana	batel	\N	\N	\N	\N
1245	2025-12-19 15:13:23.011557+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1246	2025-12-19 20:28:05.45662+00	Checklist de Fechamento	Fabiana	batel	\N	\N	\N	\N
1247	2025-12-19 22:18:44.656204+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1248	2025-12-19 22:20:21.650297+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1249	2025-12-20 15:04:27.377135+00	Checklist de Abertura	Fabiana	batel	\N	\N	\N	\N
1250	2025-12-20 15:04:44.914577+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1251	2025-12-20 16:02:17.361862+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1252	2025-12-20 20:38:19.587981+00	Checklist de Fechamento	Fabiana	batel	\N	\N	\N	\N
1253	2025-12-20 22:00:29.673606+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1254	2025-12-20 22:24:02.714694+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1255	2025-12-21 14:51:39.299518+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1256	2025-12-21 16:30:49.005816+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1257	2025-12-21 21:59:43.518646+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1258	2025-12-21 22:19:23.844293+00	Checklist de Fechamento		ahu	\N	\N	\N	\N
1259	2025-12-22 14:56:32.493343+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1260	2025-12-22 22:43:43.213323+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1261	2026-01-02 15:07:19.6952+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1262	2026-01-02 15:08:15.817527+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1263	2026-01-02 22:25:16.855628+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1264	2026-01-02 22:26:04.961221+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1265	2026-01-03 15:20:32.936929+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1266	2026-01-03 15:54:15.988596+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1267	2026-01-03 22:05:37.652328+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1268	2026-01-03 22:22:03.236669+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1269	2026-01-04 15:05:19.992559+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1270	2026-01-04 15:09:05.312155+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1271	2026-01-04 22:00:48.139948+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1272	2026-01-04 22:02:27.450989+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1273	2026-01-05 14:52:48.179621+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1274	2026-01-05 15:07:20.231338+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1275	2026-01-05 22:04:11.532423+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1276	2026-01-05 22:06:27.491821+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1277	2026-01-06 14:38:37.457769+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1278	2026-01-06 15:08:59.148794+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1279	2026-01-06 22:01:33.28657+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1280	2026-01-06 22:01:35.241895+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1281	2026-01-07 14:52:23.18758+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1282	2026-01-07 15:03:57.093837+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1283	2026-01-07 22:02:35.15623+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1284	2026-01-07 22:30:04.957536+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1285	2026-01-08 14:52:35.874798+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1286	2026-01-08 22:01:20.353087+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1287	2026-01-08 22:04:39.55955+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1288	2026-01-09 15:01:15.270182+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1289	2026-01-09 22:04:32.05412+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1290	2026-01-09 22:17:43.063331+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1291	2026-01-10 15:03:12.300386+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1292	2026-01-10 15:07:02.426583+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1293	2026-01-10 22:02:20.734195+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1294	2026-01-10 22:04:43.434104+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1295	2026-01-11 14:32:25.063994+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1296	2026-01-11 17:33:58.096238+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1297	2026-01-11 22:07:30.724479+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1298	2026-01-11 22:17:26.162858+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1299	2026-01-12 14:49:32.342568+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1300	2026-01-12 15:01:44.930005+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1301	2026-01-12 22:01:21.212313+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1302	2026-01-12 22:03:15.296813+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1303	2026-01-13 14:45:07.22923+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1304	2026-01-13 15:12:39.042946+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1305	2026-01-13 22:01:02.78183+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1306	2026-01-13 22:01:14.215983+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1307	2026-01-14 14:46:19.213024+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1308	2026-01-14 21:34:08.15782+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1309	2026-01-14 22:01:10.227561+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1310	2026-01-14 22:05:37.992185+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1311	2026-01-15 14:52:47.431006+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1312	2026-01-15 15:05:11.299524+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1313	2026-01-15 22:02:16.101999+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1314	2026-01-15 22:02:27.446749+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1315	2026-01-16 15:03:23.267285+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1316	2026-01-16 18:37:32.917711+00	Checklist de Abertura	Endryw	batel	\N	\N	\N	\N
1317	2026-01-16 22:02:58.334023+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1318	2026-01-16 22:19:27.749736+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1319	2026-01-17 16:20:39.844153+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1320	2026-01-17 22:01:42.280533+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1321	2026-01-17 22:20:39.128487+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1322	2026-01-18 14:57:41.704568+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1323	2026-01-18 15:07:43.47235+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1324	2026-01-18 22:01:40.474001+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1325	2026-01-18 22:06:34.224511+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1326	2026-01-19 15:02:49.949619+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1327	2026-01-19 22:03:16.286693+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1328	2026-01-19 22:06:08.232078+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1329	2026-01-20 14:55:28.490275+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1330	2026-01-20 18:17:22.805067+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
1331	2026-01-20 22:26:22.608286+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
1332	2026-01-21 14:07:18.106122+00	Checklist de Abertura	Endryw	batel	\N	\N	\N	\N
1333	2026-01-21 14:54:45.11595+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1334	2026-01-21 15:03:02.166861+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1335	2026-01-21 22:06:22.966366+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1336	2026-01-21 22:15:07.245019+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1337	2026-01-22 14:21:32.957001+00	Checklist de Abertura	Endryw	batel	\N	\N	\N	\N
1338	2026-01-22 14:52:48.510482+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1339	2026-01-22 14:55:04.950002+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1340	2026-01-22 22:04:44.113892+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1341	2026-01-22 22:09:22.569987+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1342	2026-01-23 13:58:34.997107+00	Checklist de Abertura	Endryw	batel	\N	\N	\N	\N
1343	2026-01-23 15:01:01.974468+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1344	2026-01-23 15:12:45.845979+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1345	2026-01-23 22:02:31.452956+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1346	2026-01-23 22:15:26.588518+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1347	2026-01-24 15:00:44.449284+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1348	2026-01-24 15:27:17.064392+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
1349	2026-01-24 22:06:09.350465+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
1350	2026-01-24 22:06:59.57747+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1351	2026-01-25 15:00:46.617046+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1352	2026-01-25 22:10:59.833653+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1353	2026-01-26 14:10:00.726516+00	Checklist de Abertura	Endryw	batel	\N	\N	\N	\N
1354	2026-01-26 14:51:34.862659+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1355	2026-01-26 15:05:07.808916+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1356	2026-01-26 22:01:22.752135+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1357	2026-01-26 22:05:41.419384+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1358	2026-01-27 14:16:33.097099+00	Checklist de Abertura	Endryw	batel	\N	\N	\N	\N
1359	2026-01-27 14:59:25.796715+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1360	2026-01-27 18:25:13.047302+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1361	2026-01-27 21:02:53.533327+00	Checklist de Fechamento	Tielly	batel	\N	\N	\N	\N
1362	2026-01-27 22:01:10.349135+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1363	2026-01-27 22:06:57.40265+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1364	2026-01-28 14:16:00.686532+00	Checklist de Abertura	Tielly	batel	\N	\N	\N	\N
1365	2026-01-28 15:04:03.756492+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1366	2026-01-28 20:53:00.126803+00	Checklist de Fechamento	Tielly	batel	\N	\N	\N	\N
1367	2026-01-28 21:21:45.933627+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1368	2026-01-28 22:01:00.947758+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1369	2026-01-28 22:27:25.732706+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1370	2026-01-29 14:13:40.02576+00	Checklist de Abertura	Tielly	batel	\N	\N	\N	\N
1371	2026-01-29 14:50:54.02863+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1372	2026-01-29 15:06:16.909407+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1373	2026-01-29 20:49:12.933028+00	Checklist de Fechamento	Tielly	batel	\N	\N	\N	\N
1374	2026-01-29 22:05:05.711561+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1375	2026-01-29 22:05:08.361499+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1376	2026-01-30 15:02:36.64296+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1377	2026-01-30 15:07:50.250957+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1378	2026-01-30 20:47:20.943328+00	Checklist de Fechamento	Tielly	batel	\N	\N	\N	\N
1379	2026-01-30 22:03:13.240471+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1380	2026-01-30 22:25:37.312044+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1381	2026-01-31 14:07:48.724622+00	Checklist de Abertura	Tielly	batel	\N	\N	\N	\N
1382	2026-01-31 15:00:57.280481+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1383	2026-01-31 15:03:13.414888+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1384	2026-01-31 17:51:59.154909+00	Checklist de Fechamento	Tielly	batel	\N	\N	\N	\N
1385	2026-01-31 22:07:14.285344+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1386	2026-01-31 22:17:50.580804+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1387	2026-02-01 15:07:04.46008+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1388	2026-02-01 16:39:25.609847+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1389	2026-02-01 22:08:42.513539+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1390	2026-02-01 22:09:16.958235+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1392	2026-02-02 14:51:07.449711+00	Checklist de Abertura	Henrique	ahu	\N	\N	\N	\N
1393	2026-02-02 21:02:10.053796+00	Checklist de Fechamento	Tielly	batel	\N	\N	\N	\N
1394	2026-02-02 22:01:08.572544+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1395	2026-02-02 22:01:42.841149+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1396	2026-02-03 14:12:48.528621+00	Checklist de Abertura	Endryw	batel	\N	\N	\N	\N
1397	2026-02-03 15:04:27.828112+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1398	2026-02-03 17:49:51.224798+00	Checklist de Abertura	Anna Beatriz	altoxv	\N	\N	\N	\N
1399	2026-02-03 20:59:36.819714+00	Checklist de Fechamento	Endryw	batel	\N	\N	\N	\N
1400	2026-02-03 22:00:35.253164+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1401	2026-02-03 22:02:00.563019+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1402	2026-02-04 14:06:33.229345+00	Checklist de Abertura		batel	\N	\N	\N	\N
1403	2026-02-04 15:01:57.781151+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1404	2026-02-04 18:31:30.533684+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1405	2026-02-04 21:00:27.639704+00	Checklist de Fechamento	Tielly	batel	\N	\N	\N	\N
1406	2026-02-04 22:01:56.058774+00	Checklist de Fechamento	Anna Beatriz	altoxv	\N	\N	\N	\N
1407	2026-02-04 22:18:01.136521+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1408	2026-02-05 14:10:15.673296+00	Checklist de Abertura	Endryw	batel	\N	\N	\N	\N
1409	2026-02-05 14:38:39.780507+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1410	2026-02-05 15:29:47.104271+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1411	2026-02-05 21:00:38.610899+00	Checklist de Fechamento	Endryw	batel	\N	\N	\N	\N
1412	2026-02-05 22:11:19.723624+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1413	2026-02-05 22:11:39.02333+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1414	2026-02-06 14:22:15.360308+00	Checklist de Abertura	Tielly	batel	\N	\N	\N	\N
1415	2026-02-06 15:01:17.906645+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1416	2026-02-06 15:04:49.665138+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1417	2026-02-06 20:58:20.993654+00	Checklist de Fechamento	Tielly	batel	\N	\N	\N	\N
1418	2026-02-06 22:11:14.78844+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1419	2026-02-06 22:31:35.775434+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1420	2026-02-07 14:05:07.161376+00	Checklist de Abertura	Endryw	batel	\N	\N	\N	\N
1421	2026-02-07 17:11:34.678322+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1422	2026-02-07 18:01:25.625906+00	Checklist de Fechamento	Endryw	batel	\N	\N	\N	\N
1423	2026-02-07 22:07:24.133051+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1424	2026-02-07 22:23:24.530277+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1425	2026-02-08 15:00:39.892492+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1426	2026-02-08 22:09:53.474095+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1427	2026-02-09 14:10:29.97362+00	Checklist de Abertura	Tielly	batel	\N	\N	\N	\N
1428	2026-02-09 15:10:17.383567+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1429	2026-02-09 15:20:57.903398+00	Checklist de Abertura	Arielle	altoxv	\N	\N	\N	\N
1430	2026-02-09 20:53:39.186782+00	Checklist de Fechamento	Tielly	batel	\N	\N	\N	\N
1431	2026-02-09 22:13:56.401332+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
1432	2026-02-10 14:13:37.760288+00	Checklist de Abertura	Endryw	batel	\N	\N	\N	\N
1433	2026-02-10 15:24:42.528776+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1434	2026-02-10 20:56:24.876686+00	Checklist de Fechamento	Tielly	batel	\N	\N	\N	\N
1435	2026-02-10 22:11:46.865023+00	Checklist de Fechamento	Arielle	altoxv	\N	\N	\N	\N
1436	2026-02-10 22:23:21.084963+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1437	2026-02-11 14:10:33.322804+00	Checklist de Abertura	Endryw	batel	\N	\N	\N	\N
1438	2026-02-11 15:04:58.645715+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1439	2026-02-11 15:07:19.803528+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1440	2026-02-11 21:00:07.387675+00	Checklist de Fechamento	Endryw	batel	\N	\N	\N	\N
1441	2026-02-11 22:17:48.810175+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1442	2026-02-11 22:38:49.871761+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1443	2026-02-12 14:19:02.889264+00	Checklist de Abertura	Endryw	batel	\N	\N	\N	\N
1444	2026-02-12 14:59:16.55923+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1445	2026-02-12 15:04:32.394226+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1446	2026-02-12 16:53:28.470039+00	Checklist de Abertura		ahu	\N	\N	\N	\N
1447	2026-02-12 21:00:04.104437+00	Checklist de Fechamento	Endryw	batel	\N	\N	\N	\N
1448	2026-02-12 22:17:37.384921+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1449	2026-02-12 22:26:19.650349+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1450	2026-02-13 14:10:25.183641+00	Checklist de Abertura	Tielly	batel	\N	\N	\N	\N
1451	2026-02-13 15:37:57.408072+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1452	2026-02-13 21:02:34.927759+00	Checklist de Fechamento	Tielly	batel	\N	\N	\N	\N
1453	2026-02-13 22:02:17.478081+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1454	2026-02-13 22:26:36.119542+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1455	2026-02-14 14:10:02.179103+00	Checklist de Abertura	Endryw	batel	\N	\N	\N	\N
1456	2026-02-14 15:04:18.248974+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1457	2026-02-14 15:14:50.434254+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1458	2026-02-14 17:58:46.416742+00	Checklist de Fechamento	Endryw	batel	\N	\N	\N	\N
1459	2026-02-14 22:12:05.612544+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1460	2026-02-14 22:12:32.115012+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1461	2026-02-15 14:55:49.791805+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1462	2026-02-15 22:14:52.969108+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1463	2026-02-15 22:15:41.712699+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1464	2026-02-15 22:18:23.636707+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1465	2026-02-16 13:42:29.55763+00	Checklist de Fechamento	Henrique	escritorio	\N	\N	\N	\N
1466	2026-02-16 14:15:20.97266+00	Checklist de Abertura	Tielly	batel	\N	\N	\N	\N
1467	2026-02-16 15:09:56.889631+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1468	2026-02-16 17:12:47.675366+00	Checklist de Fechamento		escritorio	\N	\N	\N	\N
1469	2026-02-16 20:55:41.855739+00	Checklist de Fechamento	Tielly	batel	\N	\N	\N	\N
1470	2026-02-16 22:08:36.347187+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1471	2026-02-16 22:36:52.601997+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1472	2026-02-17 14:02:41.373959+00	Checklist de Abertura	Tielly	batel	\N	\N	\N	\N
1473	2026-02-17 15:08:34.630362+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1474	2026-02-17 15:11:12.734382+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1475	2026-02-17 20:57:04.580793+00	Checklist de Fechamento	Endryw	batel	\N	\N	\N	\N
1476	2026-02-17 22:23:12.237814+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1477	2026-02-18 14:12:32.502006+00	Checklist de Abertura	Endryw	batel	\N	\N	\N	\N
1478	2026-02-18 14:40:21.56071+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1479	2026-02-18 15:09:42.567249+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1480	2026-02-18 20:53:06.60899+00	Checklist de Fechamento	Tielly	batel	\N	\N	\N	\N
1481	2026-02-18 22:20:54.259686+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1482	2026-02-18 22:53:42.79083+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1483	2026-02-19 14:08:03.811059+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1484	2026-02-19 14:11:04.423778+00	Checklist de Abertura	Endryw	batel	\N	\N	\N	\N
1485	2026-02-19 16:31:47.768356+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1486	2026-02-19 22:07:42.069783+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1487	2026-02-19 22:12:44.138744+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1488	2026-02-20 13:01:54.596097+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1489	2026-02-20 14:05:17.729898+00	Checklist de Abertura	Endryw	batel	\N	\N	\N	\N
1490	2026-02-20 15:06:08.350311+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1491	2026-02-20 20:57:24.989791+00	Checklist de Fechamento	Endryw	batel	\N	\N	\N	\N
1492	2026-02-20 22:01:03.964058+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1493	2026-02-20 22:17:59.010632+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1494	2026-02-21 14:46:28.076919+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1495	2026-02-21 15:00:09.71473+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1496	2026-02-21 22:02:25.376814+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1497	2026-02-21 22:13:23.892597+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1498	2026-02-22 14:46:32.705308+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1499	2026-02-22 15:00:02.209793+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1500	2026-02-22 22:09:03.589598+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1501	2026-02-22 22:09:49.826636+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1502	2026-02-23 13:59:42.846361+00	Checklist de Abertura	Endryw	batel	\N	\N	\N	\N
1503	2026-02-23 14:42:48.967193+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1504	2026-02-23 14:48:27.212818+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1505	2026-02-23 20:53:33.278422+00	Checklist de Fechamento	Tielly	batel	\N	\N	\N	\N
1506	2026-02-23 22:01:29.193047+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1507	2026-02-23 22:06:58.521804+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1508	2026-02-24 13:06:04.206424+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1509	2026-02-24 14:27:08.661683+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1510	2026-02-24 22:14:56.083295+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1511	2026-02-24 22:43:26.714178+00	Checklist de Fechamento	Marina	ahu	\N	\N	\N	\N
1512	2026-02-25 13:26:34.198808+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1513	2026-02-25 15:39:38.750903+00	Checklist de Abertura	Henrique	ahu	\N	\N	\N	\N
1514	2026-02-25 15:48:10.801006+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1515	2026-02-25 21:55:12.905947+00	Checklist de Fechamento	Henrique	ahu	\N	\N	\N	\N
1516	2026-02-25 22:05:29.476857+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1517	2026-02-26 12:50:16.855622+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1518	2026-02-26 16:07:54.736349+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1519	2026-02-26 22:02:06.691401+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1520	2026-02-26 22:10:22.558726+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1521	2026-02-27 12:57:14.886841+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1522	2026-02-27 15:05:27.953933+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1523	2026-02-27 21:56:03.042327+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1524	2026-02-27 22:04:23.523809+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1525	2026-02-27 22:14:25.675539+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1526	2026-02-28 14:52:12.026474+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1527	2026-02-28 15:00:03.724861+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1528	2026-02-28 22:14:24.866415+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1529	2026-02-28 22:17:11.661764+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1530	2026-03-01 14:59:45.788776+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1531	2026-03-01 15:04:03.073+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1532	2026-03-01 22:08:26.97707+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1533	2026-03-01 22:34:05.961017+00	Checklist de Fechamento		ahu	\N	\N	\N	\N
1534	2026-03-02 14:50:15.86623+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1535	2026-03-02 15:04:55.528409+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1536	2026-03-02 16:53:39.879038+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1537	2026-03-02 22:04:45.150661+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1538	2026-03-02 22:17:36.248238+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1539	2026-03-03 13:41:59.897554+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1540	2026-03-03 14:37:00.030327+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1541	2026-03-03 15:32:04.620216+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1542	2026-03-03 22:00:43.892721+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1543	2026-03-03 22:04:48.081814+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1544	2026-03-04 13:11:56.015093+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1545	2026-03-04 14:44:35.463941+00	Checklist de Abertura	Henrique	ahu	\N	\N	\N	\N
1546	2026-03-04 14:56:14.789773+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1547	2026-03-04 22:11:21.552192+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1548	2026-03-04 22:16:08.510905+00	Checklist de Fechamento	Endryw	ahu	\N	\N	\N	\N
1549	2026-03-05 13:57:03.137949+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1550	2026-03-05 14:39:05.11952+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1551	2026-03-05 15:09:29.415118+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1552	2026-03-05 22:05:59.168073+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1553	2026-03-05 22:12:53.563505+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1554	2026-03-06 12:57:40.438087+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1555	2026-03-06 14:56:16.755426+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1556	2026-03-06 15:08:19.623485+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1557	2026-03-06 22:26:13.799829+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1558	2026-03-06 22:47:06.166894+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1559	2026-03-07 14:37:16.447111+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1560	2026-03-07 17:51:35.56949+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1561	2026-03-07 22:13:28.033039+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1562	2026-03-07 22:27:43.673351+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1563	2026-03-08 14:58:08.775874+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1564	2026-03-08 15:09:19.227554+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1565	2026-03-08 22:00:08.677621+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1566	2026-03-08 22:08:34.353814+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1567	2026-03-09 14:34:41.644156+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1568	2026-03-09 14:42:27.720104+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1569	2026-03-09 15:08:49.632152+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1570	2026-03-09 22:00:32.258072+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1571	2026-03-09 22:06:59.870685+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1572	2026-03-10 14:14:52.908567+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1573	2026-03-10 17:01:36.790343+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1574	2026-03-10 20:54:58.124521+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1575	2026-03-10 21:59:33.81464+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1576	2026-03-10 22:03:36.100746+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1577	2026-03-11 14:55:52.562959+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1578	2026-03-11 14:59:18.569727+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1579	2026-03-11 16:29:03.240276+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1580	2026-03-11 22:03:38.358876+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1581	2026-03-11 22:16:24.102242+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1582	2026-03-12 14:51:39.245651+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1583	2026-03-12 16:18:30.697753+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1584	2026-03-12 16:19:18.824203+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1585	2026-03-12 22:02:37.007774+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1586	2026-03-12 22:04:55.522302+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1587	2026-03-13 14:52:18.244904+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1588	2026-03-13 14:59:19.932487+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1589	2026-03-13 15:36:53.86672+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1590	2026-03-13 22:00:39.819988+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1591	2026-03-13 22:19:53.137709+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1592	2026-03-14 14:34:38.954866+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1593	2026-03-14 15:13:32.773794+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1594	2026-03-14 21:57:55.16775+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1595	2026-03-14 22:06:42.588993+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1596	2026-03-15 15:09:38.303878+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1597	2026-03-15 15:29:23.734173+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1598	2026-03-15 22:21:29.303156+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1599	2026-03-15 22:28:04.324349+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1600	2026-03-16 14:53:00.492163+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1601	2026-03-16 15:10:23.561767+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1602	2026-03-16 15:14:30.382272+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1603	2026-03-16 22:04:33.347202+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1604	2026-03-16 22:07:25.438611+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1605	2026-03-17 14:43:53.293193+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1606	2026-03-17 15:01:20.253147+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1607	2026-03-17 15:15:02.218471+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1608	2026-03-17 22:04:18.095416+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1609	2026-03-17 22:05:23.424433+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1610	2026-03-18 15:12:40.959694+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1611	2026-03-18 15:39:00.612393+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1612	2026-03-18 16:04:24.705267+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1613	2026-03-18 22:05:19.963314+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1614	2026-03-18 22:06:46.362146+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1615	2026-03-19 14:37:51.56485+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1616	2026-03-19 15:18:14.709697+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1617	2026-03-19 18:43:05.014546+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1618	2026-03-19 19:08:48.005619+00	Checklist de Fechamento		escritorio	\N	\N	\N	\N
1619	2026-03-19 22:02:22.291292+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1620	2026-03-19 22:12:48.861533+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1621	2026-03-20 15:02:53.776675+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1622	2026-03-20 15:06:17.971368+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1623	2026-03-20 15:19:57.019089+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1624	2026-03-20 22:03:46.781157+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1625	2026-03-20 22:17:06.443977+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1626	2026-03-21 21:45:12.262323+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1627	2026-03-21 22:04:14.991414+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1628	2026-03-21 22:08:21.120969+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1629	2026-03-22 15:01:32.941846+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1630	2026-03-22 17:51:02.071177+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1631	2026-03-22 22:07:06.700084+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1632	2026-03-22 22:18:17.777826+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1633	2026-03-23 15:15:24.478025+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1634	2026-03-23 15:53:10.356543+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1635	2026-03-23 22:04:06.737503+00	Checklist de Abertura	Arielle	ahu	\N	\N	\N	\N
1636	2026-03-23 22:04:47.477535+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1637	2026-03-23 22:21:33.564234+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1638	2026-03-24 15:10:23.786145+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1639	2026-03-24 15:38:57.020216+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1640	2026-03-24 15:54:52.490604+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1641	2026-03-24 22:02:59.294627+00	Checklist de Fechamento	Arielle	ahu	\N	\N	\N	\N
1642	2026-03-24 22:15:06.110938+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1643	2026-03-25 15:12:41.613705+00	Checklist de Abertura	Endryw	ahu	\N	\N	\N	\N
1644	2026-03-25 15:35:08.008155+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1645	2026-03-25 16:46:44.186736+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1646	2026-03-25 22:10:07.723011+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1647	2026-03-25 22:40:06.759145+00	Checklist de Fechamento	Endryw	ahu	\N	\N	\N	\N
1648	2026-03-26 15:04:28.098539+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1649	2026-03-26 15:30:17.632477+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1650	2026-03-26 19:25:13.995756+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1651	2026-03-26 22:01:51.128317+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1652	2026-03-26 22:06:28.724565+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1653	2026-03-27 15:04:30.788066+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1654	2026-03-27 15:05:42.039994+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1655	2026-03-27 22:19:06.925064+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1656	2026-03-27 22:25:52.035921+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1657	2026-03-28 17:43:20.337099+00	Checklist de Abertura	Lidiane	altoxv	\N	\N	\N	\N
1658	2026-03-28 18:44:18.521249+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1659	2026-03-28 22:04:06.376425+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1660	2026-03-28 22:13:27.622525+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1661	2026-03-29 15:06:59.76874+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1662	2026-03-29 16:15:21.515029+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1663	2026-03-29 22:10:53.169334+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1664	2026-03-29 22:23:03.755228+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1665	2026-03-30 15:07:01.734614+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1666	2026-03-30 15:43:19.290188+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1667	2026-03-30 22:07:37.139176+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1668	2026-03-30 22:09:24.477623+00	Checklist de Fechamento	Lidiane	altoxv	\N	\N	\N	\N
1669	2026-03-31 14:56:02.258276+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1670	2026-03-31 15:01:08.189657+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1671	2026-03-31 15:58:39.158229+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1672	2026-03-31 22:03:36.383738+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1673	2026-03-31 22:11:41.806419+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1674	2026-04-01 15:03:45.477661+00	Checklist de Abertura	Endryw	ahu	\N	\N	\N	\N
1675	2026-04-01 15:07:11.323324+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1676	2026-04-01 17:26:02.222179+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1677	2026-04-01 22:08:51.324144+00	Checklist de Fechamento	Endryw	ahu	\N	\N	\N	\N
1678	2026-04-01 22:12:27.914923+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1679	2026-04-02 14:51:57.742126+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1680	2026-04-02 14:59:25.280635+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1681	2026-04-02 15:09:29.387647+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1682	2026-04-02 22:11:57.721362+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1683	2026-04-02 22:12:00.630765+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1684	2026-04-03 15:01:15.391832+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1685	2026-04-03 15:08:14.341597+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	\N
1686	2026-04-03 22:10:45.520961+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1687	2026-04-03 22:14:16.91121+00	Checklist de Fechamento	Henrique	altoxv	\N	\N	\N	\N
1688	2026-04-04 14:59:55.761715+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1689	2026-04-04 15:18:02.385582+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1690	2026-04-04 22:10:28.838713+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1691	2026-04-04 22:12:21.823104+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1692	2026-04-05 14:43:39.512578+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1693	2026-04-05 15:02:00.874402+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1694	2026-04-05 22:05:14.662784+00	Checklist de Fechamento	Amanda	altoxv	\N	\N	\N	\N
1695	2026-04-05 22:07:15.779778+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1696	2026-04-06 15:08:53.329308+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1697	2026-04-06 15:09:47.660606+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1698	2026-04-06 15:15:27.754624+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1699	2026-04-06 22:03:58.274828+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1700	2026-04-06 22:08:31.803405+00	Checklist de Fechamento	Amanda	altoxv	\N	\N	\N	\N
1701	2026-04-07 14:50:26.673346+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1702	2026-04-07 17:21:13.857544+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1703	2026-04-07 17:29:52.088696+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1704	2026-04-07 22:02:59.431259+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1705	2026-04-08 14:57:41.437572+00	Checklist de Abertura	Endryw	ahu	\N	\N	\N	\N
1706	2026-04-08 14:59:59.688752+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	\N
1707	2026-04-08 16:01:24.488571+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1708	2026-04-08 22:03:59.827021+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1709	2026-04-08 22:05:41.061058+00	Checklist de Fechamento	Endryw	ahu	\N	\N	\N	\N
1710	2026-04-09 14:44:45.91297+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	\N
1711	2026-04-09 15:05:14.39532+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1712	2026-04-09 15:10:37.03837+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1713	2026-04-09 22:01:52.755803+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1714	2026-04-09 22:07:08.614297+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1715	2026-04-10 14:58:20.252049+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	\N
1716	2026-04-10 14:59:50.088805+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1717	2026-04-10 15:04:10.948938+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1718	2026-04-10 21:55:18.012576+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1719	2026-04-10 22:02:19.983073+00	Checklist de Fechamento	Endryw	altoxv	\N	\N	\N	\N
1720	2026-04-11 14:34:54.112903+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1721	2026-04-11 15:05:55.220022+00	Checklist de Abertura	Endryw	ahu	\N	\N	\N	\N
1722	2026-04-11 22:07:19.928143+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1723	2026-04-11 23:12:55.435264+00	Checklist de Fechamento	Endryw	ahu	\N	\N	\N	\N
1724	2026-04-12 15:36:17.925011+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	\N
1725	2026-04-12 15:41:02.518797+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1726	2026-04-12 22:05:48.85373+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1727	2026-04-12 22:27:16.617144+00	Checklist de Fechamento	Amanda	altoxv	\N	\N	\N	\N
1728	2026-04-13 14:35:21.499908+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1729	2026-04-13 15:00:11.022415+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1730	2026-04-13 15:29:27.743155+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1731	2026-04-13 22:02:26.6207+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1732	2026-04-13 22:03:34.136331+00	Checklist de Fechamento	Amanda	altoxv	\N	\N	\N	\N
1733	2026-04-14 14:47:10.986445+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1734	2026-04-14 15:00:31.735677+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1735	2026-04-14 15:05:23.374928+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1736	2026-04-14 22:04:22.573103+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1737	2026-04-14 22:08:34.933441+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1738	2026-04-15 14:51:29.84166+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1739	2026-04-15 15:00:13.781978+00	Checklist de Abertura	Endryw	ahu	\N	\N	\N	\N
1740	2026-04-15 15:09:12.828605+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1741	2026-04-15 22:06:14.434046+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1742	2026-04-15 23:12:13.119666+00	Checklist de Fechamento	Endryw	ahu	\N	\N	\N	\N
1743	2026-04-16 14:44:50.496727+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1744	2026-04-16 14:58:56.410167+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1745	2026-04-16 15:07:11.162591+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1746	2026-04-16 22:03:40.364786+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1747	2026-04-16 22:07:46.847248+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1748	2026-04-17 15:01:50.301982+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1749	2026-04-17 15:07:09.243521+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1750	2026-04-17 15:07:48.111629+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	\N
1751	2026-04-17 22:11:20.650079+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1752	2026-04-17 22:17:31.54629+00	Checklist de Fechamento	Amanda	altoxv	\N	\N	\N	\N
1753	2026-04-18 14:59:21.702327+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	\N
1754	2026-04-18 22:05:50.986738+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1755	2026-04-18 22:06:35.206037+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1756	2026-04-19 14:52:22.543231+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1757	2026-04-19 15:23:05.982706+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1758	2026-04-19 22:07:13.993366+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1759	2026-04-19 22:12:01.632491+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1760	2026-04-20 14:59:36.368677+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1761	2026-04-20 15:11:29.831483+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1762	2026-04-20 22:07:28.790648+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1763	2026-04-20 22:15:18.983873+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1764	2026-04-21 15:05:16.358686+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1765	2026-04-21 15:15:03.623663+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1766	2026-04-21 16:40:41.801903+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1767	2026-04-21 22:10:44.613101+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1768	2026-04-21 22:11:12.47493+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1769	2026-04-22 15:11:14.743321+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1770	2026-04-22 15:52:43.953682+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1771	2026-04-22 22:07:41.58915+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1772	2026-04-23 15:04:31.254795+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1773	2026-04-23 15:08:27.007287+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1774	2026-04-23 22:04:25.601997+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1775	2026-04-23 22:05:15.352307+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1776	2026-04-24 15:06:40.943228+00	Checklist de Abertura	Endryw	ahu	\N	\N	\N	\N
1777	2026-04-24 15:11:44.96972+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1778	2026-04-24 15:53:24.235276+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	\N
1779	2026-04-24 22:00:59.407228+00	Checklist de Fechamento	Endryw	ahu	\N	\N	\N	\N
1780	2026-04-24 22:37:12.41386+00	Checklist de Fechamento	Amanda	altoxv	\N	\N	\N	\N
1781	2026-04-25 14:42:10.734396+00	Checklist de Abertura	Endryw	ahu	\N	\N	\N	\N
1782	2026-04-25 14:54:55.669583+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	\N
1783	2026-04-25 22:04:41.981351+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1784	2026-04-25 22:05:27.594506+00	Checklist de Fechamento	Endryw	ahu	\N	\N	\N	\N
1785	2026-04-26 15:07:59.863477+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1786	2026-04-26 15:11:20.067359+00	Checklist de Abertura	Endryw	ahu	\N	\N	\N	\N
1787	2026-04-26 22:03:41.936831+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1788	2026-04-26 22:07:16.179443+00	Checklist de Fechamento	Endryw	ahu	\N	\N	\N	\N
1789	2026-04-27 15:09:51.415178+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1790	2026-04-27 15:15:53.973547+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1791	2026-04-27 17:13:43.507984+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1792	2026-04-27 22:03:52.822959+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1793	2026-04-27 22:05:17.348235+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1794	2026-04-28 15:01:35.110153+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1795	2026-04-28 15:03:38.372372+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1796	2026-04-28 21:42:44.728645+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1797	2026-04-28 22:03:32.236088+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1798	2026-04-29 15:08:02.290691+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1799	2026-04-29 15:34:57.62341+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1800	2026-04-29 21:40:07.44343+00	Checklist de Fechamento	Endryw	ahu	\N	\N	\N	\N
1801	2026-04-29 21:41:45.162778+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1802	2026-04-30 15:02:57.922971+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	\N
1803	2026-04-30 15:05:38.444282+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1804	2026-04-30 16:38:37.77449+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1805	2026-04-30 22:06:47.165251+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1806	2026-04-30 22:11:16.897501+00	Checklist de Fechamento	Amanda	altoxv	\N	\N	\N	\N
1807	2026-05-01 15:14:56.416313+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	\N
1808	2026-05-01 15:23:20.432059+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1809	2026-05-01 22:18:35.662817+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1810	2026-05-01 22:21:05.631479+00	Checklist de Fechamento	Amanda	altoxv	\N	\N	\N	\N
1811	2026-05-02 14:58:04.53838+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1812	2026-05-02 15:05:19.740505+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1813	2026-05-02 22:02:52.099972+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1814	2026-05-02 22:06:13.482142+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1815	2026-05-03 14:43:42.029994+00	Checklist de Abertura	Endryw	ahu	\N	\N	\N	\N
1816	2026-05-03 15:13:13.093201+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	\N
1817	2026-05-03 22:06:42.739433+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1818	2026-05-03 22:08:41.524927+00	Checklist de Fechamento	Amanda	altoxv	\N	\N	\N	\N
1819	2026-05-04 14:56:00.410212+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	\N
1820	2026-05-04 14:59:43.536049+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1821	2026-05-04 22:03:17.664214+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1822	2026-05-04 22:04:13.497038+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1823	2026-05-05 15:00:12.641272+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1824	2026-05-05 15:02:09.583389+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1825	2026-05-05 15:07:35.095308+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1826	2026-05-05 22:08:51.773674+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1827	2026-05-05 22:26:23.547275+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1828	2026-05-06 15:03:50.453623+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1829	2026-05-06 15:05:29.217993+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1830	2026-05-06 15:05:38.718782+00	Checklist de Abertura	Endryw	ahu	\N	\N	\N	\N
1831	2026-05-06 22:02:05.395041+00	Checklist de Fechamento	Endryw	ahu	\N	\N	\N	\N
1832	2026-05-06 22:02:55.993955+00	Checklist de Fechamento	Amanda	altoxv	\N	\N	\N	\N
1833	2026-05-07 14:56:14.41686+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1834	2026-05-07 15:03:20.319669+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1835	2026-05-07 15:35:11.124648+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1836	2026-05-07 22:01:22.628978+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1837	2026-05-07 22:03:55.147161+00	Checklist de Fechamento	Amanda	altoxv	\N	\N	\N	\N
1838	2026-05-08 15:09:01.639862+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	\N
1839	2026-05-08 15:19:18.979759+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	\N
1840	2026-05-08 15:26:36.302485+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1844	2026-05-08 22:01:45.266571+00	Checklist de Fechamento	Sthefani	ahu	\N	\N	\N	\N
1845	2026-05-09 14:35:36.020405+00	Checklist de Abertura	Endryw	ahu	\N	\N	\N	{"total": 327.15, "denominacoes": {"ten": 11, "two": 8, "five": 14, "fifty": "", "twenty": 6, "hundred": "", "oneCent": "", "oneReal": 9, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1846	2026-05-09 14:55:18.622888+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1847	2026-05-09 21:56:13.735993+00	Checklist de Fechamento	Sthefani	ahu	11	5	1	\N
1848	2026-05-10 14:34:02.186216+00	Checklist de Abertura	Endryw	ahu	\N	\N	\N	{"total": 344.15, "denominacoes": {"ten": 11, "two": 7, "five": 14, "fifty": "", "twenty": 7, "hundred": "", "oneCent": "", "oneReal": 8, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1849	2026-05-10 14:43:57.73382+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1850	2026-05-10 22:04:42.322233+00	Checklist de Fechamento	Amanda	altoxv	\N	\N	\N	\N
1851	2026-05-10 22:11:23.745579+00	Checklist de Fechamento	Endryw	ahu	9	4	14	\N
1852	2026-05-11 15:07:17.08864+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1853	2026-05-11 15:17:38.818715+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1854	2026-05-11 15:34:57.426884+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	{"total": 344.15, "denominacoes": {"ten": 11, "two": 7, "five": 14, "fifty": "", "twenty": 7, "hundred": "", "oneCent": "", "oneReal": 8, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1855	2026-05-11 22:01:51.001717+00	Checklist de Fechamento	Sthefani	ahu	9	4	12	\N
1856	2026-05-11 22:04:12.69005+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1857	2026-05-12 15:04:27.65905+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1858	2026-05-12 18:04:33.550135+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1859	2026-05-12 20:58:31.640607+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	{"total": 395.15, "denominacoes": {"ten": 9, "two": 5, "five": 13, "fifty": 2, "twenty": 6, "hundred": "", "oneCent": "", "oneReal": 8, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1860	2026-05-12 22:03:58.173478+00	Checklist de Fechamento	Sthefani	ahu	8	3	11	\N
1861	2026-05-12 22:06:44.386879+00	Checklist de Fechamento	Cassia	altoxv	\N	\N	\N	\N
1862	2026-05-13 14:38:44.306211+00	Checklist de Abertura	Endryw	ahu	\N	\N	\N	{"total": 414.15, "denominacoes": {"ten": 9, "two": 5, "five": 13, "fifty": 2, "twenty": 7, "hundred": "", "oneCent": "", "oneReal": 7, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1863	2026-05-13 14:54:55.659131+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1864	2026-05-13 16:27:04.340193+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1865	2026-05-13 22:00:03.596483+00	Checklist de Fechamento	Endryw	ahu	08	3	10	\N
1866	2026-05-13 22:04:34.363334+00	Checklist de Fechamento	Amanda	altoxv	\N	\N	\N	\N
1867	2026-05-14 14:49:10.621317+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1868	2026-05-14 15:13:42.140769+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	{"total": 438.15, "denominacoes": {"ten": 9, "two": 7, "five": 13, "fifty": 2, "twenty": 8, "hundred": "", "oneCent": "", "oneReal": 7, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1869	2026-05-14 15:56:16.493874+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1870	2026-05-14 22:02:17.269445+00	Checklist de Fechamento	Sthefani	ahu	0	3	9	\N
1871	2026-05-14 22:03:06.939859+00	Checklist de Fechamento	Amanda	altoxv	\N	\N	\N	\N
1872	2026-05-15 15:04:23.002858+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	\N
1873	2026-05-15 15:07:34.864495+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1874	2026-05-15 22:00:48.345916+00	Checklist de Fechamento	Sthefani	ahu	10	3	9	\N
1875	2026-05-15 22:05:30.498569+00	Checklist de Fechamento	Amanda	altoxv	\N	\N	\N	\N
1876	2026-05-16 14:58:16.366573+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	\N
1877	2026-05-16 22:02:24.828904+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	{"total": 550.15, "denominacoes": {"ten": 10, "two": 5, "five": 16, "fifty": 3, "twenty": 10, "hundred": "", "oneCent": "", "oneReal": 8, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1878	2026-05-16 22:02:51.650475+00	Checklist de Fechamento	Amanda	altoxv	\N	\N	\N	\N
1879	2026-05-16 22:03:18.157163+00	Checklist de Fechamento	Sthefani	ahu	3	1	6	\N
1880	2026-05-17 14:57:26.931124+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	\N
1881	2026-05-17 15:00:52.163102+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	{"total": 550.15, "denominacoes": {"ten": 10, "two": 5, "five": 16, "fifty": 3, "twenty": 10, "hundred": "", "oneCent": "", "oneReal": 8, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1882	2026-05-17 22:02:57.833541+00	Checklist de Fechamento	Amanda	altoxv	\N	\N	\N	\N
1883	2026-05-17 22:04:10.1722+00	Checklist de Fechamento	Sthefani	ahu	10	1	6	\N
1888	2026-05-18 15:02:33.780478+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	\N
1889	2026-05-18 15:02:40.125446+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	{"total": 550.15, "denominacoes": {"ten": 10, "two": 5, "five": 16, "fifty": 3, "twenty": 10, "hundred": "", "oneCent": "", "oneReal": 8, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1890	2026-05-18 16:05:34.901743+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1891	2026-05-18 22:02:45.709176+00	Checklist de Fechamento	Sthefani	ahu	10 [10 (venc. 25/05/2026)]	1 [1 (venc. 02/06/2026)]	5	\N
1892	2026-05-18 22:03:30.154853+00	Checklist de Fechamento	Amanda	altoxv	10 [10 (venc. 25/05/2026)]	2 [2 (venc. 17/05/2026)]		\N
1893	2026-05-19 14:55:24.55209+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	{"total": 300.15, "denominacoes": {"ten": 10, "two": 5, "five": 16, "fifty": "", "twenty": 5, "hundred": "", "oneCent": "", "oneReal": 8, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1894	2026-05-19 14:58:53.58507+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	\N
1895	2026-05-19 15:04:28.76876+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1896	2026-05-19 22:03:27.405194+00	Checklist de Fechamento	Sthefani	ahu	7 [7 (venc. 25/05/2026)]	1 [1 (venc. 02/06/2026)]	3	\N
1897	2026-05-19 22:09:20.963299+00	Checklist de Fechamento	Cassia	altoxv	8 [8 (venc. 25/05/2026)]	2 [2 (venc. 17/06/2026)]	4	\N
1898	2026-05-20 14:44:49.823128+00	Checklist de Abertura	Endryw	ahu	\N	\N	\N	{"total": 375.15, "denominacoes": {"ten": 10, "two": 5, "five": 15, "fifty": "", "twenty": 4, "hundred": 1, "oneCent": "", "oneReal": 8, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1899	2026-05-20 14:59:08.492066+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	{"total": 221.7, "denominacoes": {"ten": "", "two": "", "five": "", "fifty": "", "twenty": 1, "hundred": 2, "oneCent": "", "oneReal": 1, "tenCents": 2, "fiveCents": "", "fiftyCents": 1, "twentyFiveCents": ""}}
1900	2026-05-20 16:15:51.787343+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1901	2026-05-20 22:02:37.157949+00	Checklist de Fechamento	Amanda	altoxv	3 [3 (venc. 25/05/2026)]	8 [8 (venc. 17/06/2026)]		\N
1902	2026-05-20 22:04:50.191644+00	Checklist de Fechamento	Endryw	ahu	6 [6 (venc. 25/05/2026)]	8 [1 (venc. 02/06/2026), 7 (venc. 17/06/2026)]	3	\N
1903	2026-05-21 14:41:04.894014+00	Checklist de Abertura	Endryw	ahu	\N	\N	\N	{"total": 375.15, "denominacoes": {"ten": 10, "two": 5, "five": 15, "fifty": "", "twenty": 4, "hundred": 1, "oneCent": "", "oneReal": 8, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1904	2026-05-21 14:58:24.642761+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	{"total": 256.7, "denominacoes": {"ten": 7, "two": 6, "five": 1, "fifty": "", "twenty": 8, "hundred": "", "oneCent": "", "oneReal": 8, "tenCents": 14, "fiveCents": 6, "fiftyCents": "", "twentyFiveCents": ""}}
1905	2026-05-21 15:21:11.290023+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1906	2026-05-21 22:03:31.960556+00	Checklist de Fechamento	Amanda	altoxv	11 [11 (venc. 18/05/2026)]	7 [7 (venc. 17/06/2026)]	2	\N
1907	2026-05-22 15:01:04.632047+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	{"total": 279.7, "denominacoes": {"ten": 7, "two": 7, "five": 1, "fifty": "", "twenty": 9, "hundred": "", "oneCent": "", "oneReal": 9, "tenCents": 14, "fiveCents": 6, "fiftyCents": "", "twentyFiveCents": ""}}
1908	2026-05-22 15:55:23.151773+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	{"total": 263.15, "denominacoes": {"ten": 9, "two": 4, "five": 15, "fifty": "", "twenty": 4, "hundred": "", "oneCent": "", "oneReal": 8, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1909	2026-05-22 16:10:34.477161+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1910	2026-05-22 22:04:31.005788+00	Checklist de Fechamento	Sthefani	ahu	12 [2 (venc. 25/05/2026), 10 (venc. 30/05/2026)]	8 [1 (venc. 02/06/2026), 7 (venc. 17/06/2026)]	7	\N
1911	2026-05-22 22:07:59.944875+00	Checklist de Fechamento	Amanda	altoxv	10 [10 (venc. 25/05/2026)]	5 [5 (venc. 10/06/2026)]	1	\N
1912	2026-05-23 14:41:11.85251+00	Checklist de Abertura	Endryw	ahu	\N	\N	\N	{"total": 263.15, "denominacoes": {"ten": 9, "two": 4, "five": 15, "fifty": "", "twenty": 4, "hundred": "", "oneCent": "", "oneReal": 8, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1913	2026-05-23 14:49:36.093735+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	{"total": 279.7, "denominacoes": {"ten": 7, "two": 7, "five": 1, "fifty": "", "twenty": 9, "hundred": "", "oneCent": "", "oneReal": 9, "tenCents": 14, "fiveCents": 6, "fiftyCents": "", "twentyFiveCents": ""}}
1914	2026-05-23 22:00:56.60296+00	Checklist de Fechamento	Sthefani	ahu	10 [10 (venc. 30/05/2026)]	8 [1 (venc. 02/06/2026), 7 (venc. 17/06/2026)]	6	\N
1915	2026-05-23 22:02:50.947559+00	Checklist de Fechamento	Amanda	altoxv	4 [4 (venc. 25/05/2026)]	5 [5 (venc. 17/06/2026)]		\N
1916	2026-05-24 14:59:10.670388+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	{"total": 263.15, "denominacoes": {"ten": 9, "two": 4, "five": 15, "fifty": "", "twenty": 4, "hundred": "", "oneCent": "", "oneReal": 8, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1917	2026-05-24 15:09:27.783181+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	{"total": 0, "denominacoes": {"ten": "", "two": "", "five": "", "fifty": "", "twenty": "", "hundred": "", "oneCent": "", "oneReal": "", "tenCents": "", "fiveCents": "", "fiftyCents": "", "twentyFiveCents": ""}}
1918	2026-05-24 22:02:23.841673+00	Checklist de Fechamento	Sthefani	ahu	4 [4 (venc. 30/05/2026)]	6 [6 (venc. 17/06/2026)]	5	\N
1919	2026-05-24 22:03:08.473028+00	Checklist de Fechamento	Cassia	altoxv	11 [10 (venc. 30/05/2026), 1 (venc. 25/05/2026)]	7 [6 (venc. 17/06/2026), 1 (venc. 02/06/2026)]	7	\N
1920	2026-05-25 14:54:31.68006+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	{"total": 298.7, "denominacoes": {"ten": 9, "two": 7, "five": 1, "fifty": "", "twenty": 9, "hundred": "", "oneCent": "", "oneReal": 8, "tenCents": 14, "fiveCents": 6, "fiftyCents": "", "twentyFiveCents": ""}}
1921	2026-05-25 15:02:52.275174+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	{"total": 330.15, "denominacoes": {"ten": 8, "two": 4, "five": 15, "fifty": "", "twenty": 3, "hundred": 1, "oneCent": "", "oneReal": 5, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1922	2026-05-25 15:39:17.161757+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1923	2026-05-25 22:02:40.175712+00	Checklist de Fechamento	Cassia	altoxv	4 [4 (venc. 30/05/2026)]	7 [6 (venc. 17/06/2026), 1 (venc. 02/06/2026)]	4	\N
1924	2026-05-25 22:02:57.348114+00	Checklist de Fechamento	Sthefani	ahu	9 [9 (venc. 30/05/2026)]	6 [6 (venc. 17/06/2026)]	3	\N
1925	2026-05-26 15:08:04.822501+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	{"total": 296.6, "denominacoes": {"ten": 9, "two": 6, "five": 1, "fifty": 0, "twenty": 9, "hundred": 0, "oneCent": "", "oneReal": 8, "tenCents": 13, "fiveCents": 6, "fiftyCents": 0, "twentyFiveCents": 0}}
1926	2026-05-26 15:21:18.160804+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	{"total": 330.15, "denominacoes": {"ten": 8, "two": 4, "five": 15, "fifty": "", "twenty": 3, "hundred": 1, "oneCent": "", "oneReal": 5, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1927	2026-05-26 15:38:10.147926+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1928	2026-05-26 22:01:11.771006+00	Checklist de Fechamento	Sthefani	ahu	7 [7 (venc. 30/05/2026)]	6 [6 (venc. 17/06/2026)]	2	\N
1929	2026-05-26 22:07:12.705868+00	Checklist de Fechamento	Cassia	altoxv	2 [2 (venc. 30/05/2026)]	6 [6 (venc. 17/06/2026)]	5	\N
1930	2026-05-27 15:01:41.624301+00	Checklist de Abertura	Endryw	ahu	\N	\N	\N	{"total": 365.15, "denominacoes": {"ten": 10, "two": 2, "five": 15, "fifty": "", "twenty": 4, "hundred": 1, "oneCent": "", "oneReal": 4, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1931	2026-05-27 15:07:09.640927+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	{"total": 296.6, "denominacoes": {"ten": 9, "two": 6, "five": 1, "fifty": "", "twenty": 9, "hundred": "", "oneCent": "", "oneReal": 8, "tenCents": 13, "fiveCents": 6, "fiftyCents": "", "twentyFiveCents": ""}}
1932	2026-05-27 16:03:37.868957+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1933	2026-05-27 22:00:52.386746+00	Checklist de Fechamento	Endryw	ahu	6 [6 (venc. 30/05/2026)]	6 [6 (venc. 17/06/2026)]	1	\N
1934	2026-05-27 22:02:40.479353+00	Checklist de Fechamento	Cassia	altoxv	11 [10 (venc. 04/06/2026), 1 (venc. 30/05/2026)]	5 [5 (venc. 17/06/2026)]	4	\N
1935	2026-05-28 14:56:33.320829+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	{"total": 436.5, "denominacoes": {"ten": 8, "two": 5, "five": 0, "fifty": 0, "twenty": 12, "hundred": 1, "oneCent": "", "oneReal": 5, "tenCents": 12, "fiveCents": 6, "fiftyCents": "", "twentyFiveCents": ""}}
1936	2026-05-28 15:02:18.753376+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	{"total": 231.15, "denominacoes": {"ten": 5, "two": "", "five": 15, "fifty": "", "twenty": "", "hundred": 1, "oneCent": "", "oneReal": 4, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1937	2026-05-28 16:08:17.123134+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1938	2026-05-28 22:02:22.599495+00	Checklist de Fechamento	Sthefani	ahu	3 [3 (venc. 30/05/2026)]	4 [4 (venc. 17/06/2026)]	7	\N
1939	2026-05-28 22:02:43.53474+00	Checklist de Fechamento	Amanda	altoxv	4 [4 (venc. 04/06/2026)]	3 [3 (venc. 17/06/2026)]	3	\N
1940	2026-05-29 15:04:25.7956+00	Checklist de Abertura	Amanda	altoxv	\N	\N	\N	{"total": 436.5, "denominacoes": {"ten": 8, "two": 5, "five": "", "fifty": "", "twenty": 12, "hundred": 1, "oneCent": "", "oneReal": 5, "tenCents": 12, "fiveCents": 6, "fiftyCents": "", "twentyFiveCents": ""}}
1941	2026-05-29 16:00:47.406754+00	Checklist de Fechamento	Talita	escritorio	\N	\N	\N	\N
1942	2026-05-29 17:21:24.388601+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	{"total": 231.15, "denominacoes": {"ten": 5, "two": "", "five": 15, "fifty": "", "twenty": "", "hundred": 1, "oneCent": "", "oneReal": 4, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1943	2026-05-29 22:02:58.808126+00	Checklist de Fechamento	Sthefani	ahu	13 [10 (venc. 04/06/2026), 3 (venc. 30/05/2026)]	4 [4 (venc. 17/06/2026)]	06	\N
1944	2026-05-29 22:06:15.779256+00	Checklist de Fechamento	Amanda	altoxv	12 [3 (venc. 04/06/2026), 9 (venc. 04/06/2026)]	3 [3 (venc. 17/06/2026)]	2	\N
1945	2026-05-30 15:02:37.244665+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	{"total": 231.15, "denominacoes": {"ten": 5, "two": "", "five": 15, "fifty": "", "twenty": "", "hundred": 1, "oneCent": "", "oneReal": 4, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}
1946	2026-05-30 15:04:27.698694+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	{"total": 336.5, "denominacoes": {"ten": 8, "two": 5, "five": "", "fifty": "", "twenty": 12, "hundred": "", "oneCent": "", "oneReal": 5, "tenCents": 12, "fiveCents": 6, "fiftyCents": "", "twentyFiveCents": ""}}
1947	2026-05-30 22:01:59.932758+00	Checklist de Fechamento	Sthefani	ahu	10 [10 (venc. 04/06/2026)]	4 [4 (venc. 17/06/2026)]	3	\N
1948	2026-05-30 22:03:04.594746+00	Checklist de Fechamento	Cassia	altoxv	8 [8 (venc. 04/06/2026)]	3 [3 (venc. 17/06/2026)]	1	\N
1949	2026-05-31 15:02:15.298033+00	Checklist de Abertura	Sthefani	ahu	\N	\N	\N	{"total": 184.65, "denominacoes": {"ten": 12, "two": 7, "five": 8, "fifty": "", "twenty": "", "hundred": "", "oneCent": "", "oneReal": 9, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 1}}
1950	2026-05-31 15:13:05.688248+00	Checklist de Abertura	Cassia	altoxv	\N	\N	\N	{"total": 355.5, "denominacoes": {"ten": 8, "two": 5, "five": "", "fifty": "", "twenty": 13, "hundred": "", "oneCent": "", "oneReal": 4, "tenCents": 12, "fiveCents": 6, "fiftyCents": "", "twentyFiveCents": ""}}
1951	2026-05-31 22:07:41.87814+00	Checklist de Fechamento	Cassia	altoxv	6 [6 (venc. 04/06/2026)]	7 [7 (venc. 30/06/2026)]	0	\N
1952	2026-05-31 22:16:54.184487+00	Checklist de Fechamento	Sthefani	ahu	4 [4 (venc. 04/06/2026)]	1 [1 (venc. 17/06/2026)]	2	\N
\.


--
-- Data for Name: Vales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."Vales" ("id", "created_at", "Nome", "Unidade", "Item") FROM stdin;
10	2025-10-23 18:37:39.806334+00	Luiza	Batel	Waffle de Liege
11	2025-10-23 18:37:57.856123+00	Luiza	Batel	Nutella - 40gr
12	2025-10-23 18:38:15.221588+00	Luiza	Batel	Morango - 35gr
13	2025-10-23 21:46:58.799459+00	Sthefani	Ahu	Refri, Chá ou Suco
14	2025-10-23 21:47:16.906511+00	Sthefani	Ahu	Refri, Chá ou Suco
15	2025-10-24 16:47:28.640038+00	Arielle	Alto da XV	Refri, Chá ou Suco
16	2025-10-24 17:01:28.565456+00	Henrique	Alto da XV	Pequeno ( 1 Sabor )
17	2025-10-24 17:01:46.559942+00	Henrique	Alto da XV	Refri, Chá ou Suco
18	2025-10-24 17:12:59.077904+00	Henrique	Alto da XV	Refri, Chá ou Suco
19	2025-10-24 17:13:20.342658+00	Henrique	Alto da XV	Refri, Chá ou Suco
20	2025-10-24 17:13:33.778161+00	Henrique	Alto da XV	Refri, Chá ou Suco
21	2025-10-24 17:13:43.437403+00	Henrique	Alto da XV	Refri, Chá ou Suco
22	2025-10-24 17:13:53.92075+00	Henrique	Alto da XV	Refri, Chá ou Suco
23	2025-10-24 17:35:38.523146+00	Sthefani	Ahu	Gelato Carmella - 60gr
24	2025-10-24 19:04:51.12711+00	Henrique	Ahu	Espresso Lungo
25	2025-10-24 19:05:02.263294+00	Henrique	Ahu	Espresso Lungo
26	2025-10-24 21:42:37.261642+00	Sthefani	Ahu	Refri, Chá ou Suco
27	2025-10-25 17:12:46.328106+00	Marina	Alto da XV	Refri, Chá ou Suco
28	2025-10-25 21:20:03.416937+00	Arielle	Ahu	Pote 480ml
29	2025-10-25 22:13:37.958119+00	Sthefani	Ahu	Refri, Chá ou Suco
30	2025-10-25 22:13:50.990277+00	Sthefani	Ahu	Pote 480ml
31	2025-10-25 22:14:21.974938+00	Arielle	Ahu	Brownie
32	2025-10-25 22:14:35.060365+00	Arielle	Ahu	Brownie
33	2025-10-26 16:39:24.568708+00	Marina	Alto da XV	Médio ( até 2 Sabores )
34	2025-10-26 17:52:04.24786+00	Arielle	Ahu	Refri, Chá ou Suco
35	2025-10-27 14:47:36.797014+00	Arielle	Ahu	Waffle de Liege
36	2025-10-27 14:49:12.2352+00	Arielle	Ahu	Waffle de Liege
37	2025-10-27 14:50:05.900297+00	Arielle	Ahu	Nutella - 40gr
38	2025-10-27 17:27:19.543067+00	Luiza	Batel	Grande ( até 3 Sabores )
39	2025-10-27 18:31:52.734242+00	Arielle	Ahu	Refri, Chá ou Suco
40	2025-10-28 18:17:30.439946+00	Arielle	Ahu	Sanduíche de Carne
41	2025-10-28 18:17:47.064243+00	Arielle	Ahu	Refri, Chá ou Suco
42	2025-10-28 21:27:16.122229+00	Sthefani	Ahu	Waffle de Liege
43	2025-10-28 21:27:30.343313+00	Sthefani	Ahu	Nutella - 40gr
44	2025-10-31 21:34:59.796116+00	Sthefani	Ahu	Waffle de Liege
45	2025-10-31 21:35:09.776288+00	Sthefani	Ahu	Gelato Carmella - 60gr
46	2025-10-31 21:35:20.741188+00	Sthefani	Ahu	Nutella - 40gr
47	2025-10-31 22:11:08.352851+00	Arielle	Alto da XV	Brownie
48	2025-11-01 15:45:23.450119+00	Anna Beatriz	Alto da XV	Médio ( até 2 Sabores )
49	2025-11-01 15:45:39.203282+00	Anna Beatriz	Alto da XV	Sanduíche de Mortadela
50	2025-11-01 16:14:25.319358+00	Luiza	Batel	Refri, Chá ou Suco
51	2025-11-01 17:31:52.504243+00	Arielle	Ahu	Refri, Chá ou Suco
52	2025-11-02 16:52:19.202587+00	Anna Beatriz	Alto da XV	Pequeno ( 1 Sabor )
53	2025-11-03 16:10:58.570001+00	Luiza	Batel	Refri, Chá ou Suco
54	2025-11-03 20:00:12.578331+00	Anna Beatriz	Alto da XV	Pote 480ml
55	2025-11-04 14:44:03.025499+00	Luiza	Batel	Waffle de Liege
56	2025-11-04 14:44:18.065339+00	Luiza	Batel	Doce de Leite - 40gr
57	2025-11-04 14:44:38.866389+00	Luiza	Batel	Banana - 35gr
58	2025-11-04 14:44:54.47305+00	Luiza	Batel	Confete - 30gr
59	2025-11-04 14:45:14.956526+00	Luiza	Batel	Espresso Simples
60	2025-11-04 15:01:15.116682+00	Luiza	Batel	Médio ( até 2 Sabores )
61	2025-11-04 15:01:40.876405+00	Luiza	Batel	Waffle de Liege
62	2025-11-04 15:01:54.946436+00	Luiza	Batel	Doce de Leite - 40gr
63	2025-11-04 15:02:07.459725+00	Luiza	Batel	Banana - 35gr
64	2025-11-04 15:02:21.351206+00	Luiza	Batel	Confete - 30gr
65	2025-11-04 17:35:40.760913+00	Sthefani	Ahu	Refri, Chá ou Suco
66	2025-11-05 17:11:06.784817+00	Luiza	Batel	Grande ( até 3 Sabores )
67	2025-11-05 20:53:46.699638+00	Henrique	Ahu	Refri, Chá ou Suco
68	2025-11-06 13:55:33.682053+00	Luiza	Batel	Espresso Simples
69	2025-11-06 18:49:12.690997+00	Luiza	Batel	Paçoca - 1un
70	2025-11-08 16:37:46.278989+00	Sthefani	Ahu	Refri, Chá ou Suco
71	2025-11-08 17:09:36.22612+00	Arielle	Ahu	Refri, Chá ou Suco
72	2025-11-09 17:29:27.201418+00	Arielle	Ahu	Refri, Chá ou Suco
73	2025-11-09 20:58:58.186894+00	Anna Beatriz	Alto da XV	Brownie
74	2025-11-10 17:24:44.599562+00	Sthefani	Ahu	Pote 480ml
75	2025-11-10 17:24:57.951316+00	Sthefani	Ahu	Refri, Chá ou Suco
76	2025-11-11 16:34:09.221424+00	Sthefani	Ahu	Refri, Chá ou Suco
77	2025-11-11 17:03:43.892591+00	Anna Beatriz	Alto da XV	Médio ( até 2 Sabores )
78	2025-11-11 18:24:34.958035+00	Luiza	Batel	COMBO SEXTA - Doce de Leite e Banana
79	2025-11-12 14:02:11.972178+00	Arielle	Ahu	Brownie
80	2025-11-12 14:55:22.820903+00	Marina	Alto da XV	Refri, Chá ou Suco
81	2025-11-12 18:26:30.517612+00	Arielle	Ahu	Refri, Chá ou Suco
82	2025-11-12 19:31:38.393558+00	Henrique	Ahu	Refri, Chá ou Suco
85	2025-11-13 16:51:40.535604+00	Sthefani	Ahu	Refri, Chá ou Suco
86	2025-11-13 17:01:31.247488+00	Anna Beatriz	Alto da XV	Médio ( até 2 Sabores )
87	2025-11-13 19:37:05.653617+00	Henrique	Ahu	Refri, Chá ou Suco
88	2025-11-13 19:55:54.095626+00	Sthefani	Ahu	Waffle de Liege
89	2025-11-13 19:56:08.577355+00	Sthefani	Ahu	Nutella - 40gr
90	2025-11-14 15:29:48.803989+00	Talita	Alto da XV	Refri, Chá ou Suco
91	2025-11-14 17:50:19.985911+00	Arielle	Alto da XV	Refri, Chá ou Suco
92	2025-11-16 15:05:14.266608+00	Arielle	Ahu	Nutella - 40gr
93	2025-11-16 16:27:19.59917+00	Sthefani	Ahu	Refri, Chá ou Suco
94	2025-11-16 17:12:41.582391+00	Anna Beatriz	Alto da XV	Médio ( até 2 Sabores )
95	2025-11-16 17:12:57.405251+00	Anna Beatriz	Alto da XV	Sanduíche de Mortadela
96	2025-11-16 21:03:35.266579+00	Arielle	Ahu	Pote 480ml
97	2025-11-17 14:41:22.39967+00	Sthefani	Ahu	Mocha
98	2025-11-17 15:58:52.23219+00	Talita	Alto da XV	Refri, Chá ou Suco
99	2025-11-18 16:53:12.094349+00	Marina	Alto da XV	Refri, Chá ou Suco
100	2025-11-18 16:53:22.484559+00	Marina	Alto da XV	Refri, Chá ou Suco
101	2025-11-18 17:06:51.0689+00	Talita	Alto da XV	Chocolate Quente
102	2025-11-18 17:56:38.46972+00	Sthefani	Ahu	Refri, Chá ou Suco
103	2025-11-18 22:00:28.131725+00	Sthefani	Ahu	Capuccino Brasileiro
104	2025-11-18 22:04:00.556904+00	Arielle	Ahu	Refri, Chá ou Suco
105	2025-11-19 15:32:48.006681+00	Talita	Alto da XV	Sanduíche de Carne
106	2025-11-19 15:33:12.102647+00	Talita	Alto da XV	Refri, Chá ou Suco
107	2025-11-19 15:39:11.03655+00	Anna Beatriz	Alto da XV	Sanduíche de Mortadela
108	2025-11-19 15:39:23.942539+00	Anna Beatriz	Alto da XV	Médio ( até 2 Sabores )
109	2025-11-19 18:17:50.93053+00	Talita	Alto da XV	Pequeno ( 1 Sabor )
110	2025-11-19 22:52:13.396357+00	Arielle	Ahu	Waffle de Liege
111	2025-11-19 22:52:40.034781+00	Arielle	Ahu	Brownie
217	2025-12-10 22:32:13.289821+00	Arielle	Ahu	Brownie
112	2025-11-20 15:54:21.897571+00	Marina	Alto da XV	Refri, Chá ou Suco
113	2025-11-22 15:57:10.735871+00	Sthefani	Ahu	Refri, Chá ou Suco
114	2025-11-22 17:40:27.975033+00	Sthefani	Ahu	Sanduíche de Mortadela
115	2025-11-22 17:40:42.543632+00	Sthefani	Ahu	Café Passado
116	2025-11-22 18:54:29.759091+00	Sthefani	Ahu	Caramel - Latte
117	2025-11-23 15:23:16.796198+00	Sthefani	Ahu	Capuccino Brasileiro
118	2025-11-23 17:30:36.147628+00	Sthefani	Ahu	Refri, Chá ou Suco
119	2025-11-23 21:54:52.095866+00	Sthefani	Ahu	Sanduíche de Frango
120	2025-11-25 12:17:31.316298+00	Talita	Alto da XV	Pequeno ( 1 Sabor )
121	2025-11-25 12:17:51.856673+00	Talita	Alto da XV	Médio ( até 2 Sabores )
122	2025-11-25 12:18:05.656467+00	Talita	Alto da XV	Refri, Chá ou Suco
123	2025-11-25 12:18:20.583506+00	Talita	Alto da XV	COMBO SEGUNDA - Nutella e Morango
124	2025-11-25 15:25:54.348449+00	Sthefani	Ahu	Capuccino Brasileiro
125	2025-11-25 19:03:00.644282+00	Sthefani	Ahu	Refri, Chá ou Suco
126	2025-11-26 15:41:39.565877+00	Marina	Alto da XV	Refri, Chá ou Suco
127	2025-11-26 15:44:25.97911+00	Talita	Alto da XV	Refri, Chá ou Suco
128	2025-11-26 15:44:57.478954+00	Talita	Alto da XV	Sanduíche de Parma
129	2025-11-26 15:45:13.685864+00	Talita	Alto da XV	Refri, Chá ou Suco
130	2025-11-26 20:11:51.279959+00	Lidiane	Alto da XV	Pequeno ( 1 Sabor )
131	2025-11-27 15:37:12.525877+00	Talita	Alto da XV	Refri, Chá ou Suco
132	2025-11-27 15:44:29.167106+00	Sthefani	Ahu	Mocha
133	2025-11-27 16:23:25.11618+00	Marina	Alto da XV	Brownie + Gelato
134	2025-11-27 17:05:12.444999+00	Sthefani	Ahu	Refri, Chá ou Suco
135	2025-11-27 17:33:42.423479+00	Lidiane	Alto da XV	Refri, Chá ou Suco
136	2025-11-28 15:15:52.151375+00	Sthefani	Ahu	Latte
137	2025-11-28 16:07:14.462664+00	Talita	Alto da XV	Refri, Chá ou Suco
138	2025-11-28 18:05:04.987421+00	Arielle	Alto da XV	Refri, Chá ou Suco
139	2025-11-28 18:08:22.49411+00	Sthefani	Ahu	Refri, Chá ou Suco
140	2025-11-29 17:15:54.081256+00	Anna Beatriz	Alto da XV	Sanduíche de Frango
141	2025-11-29 17:16:02.430977+00	Anna Beatriz	Alto da XV	Refri, Chá ou Suco
142	2025-11-29 18:01:20.910793+00	Anna Beatriz	Alto da XV	Médio ( até 2 Sabores )
143	2025-11-29 19:28:13.969861+00	Henrique	Alto da XV	Refri, Chá ou Suco
144	2025-11-30 15:19:37.462077+00	Sthefani	Ahu	Latte
145	2025-11-30 15:41:09.492335+00	Arielle	Ahu	Nutella - 40gr
146	2025-11-30 17:35:28.806603+00	Lidiane	Alto da XV	Refri, Chá ou Suco
147	2025-11-30 17:43:07.612738+00	Arielle	Ahu	Sanduíche de Parma
148	2025-11-30 18:15:06.80742+00	Lidiane	Alto da XV	Pequeno ( 1 Sabor )
149	2025-11-30 19:16:43.342759+00	Marina	Alto da XV	Médio ( até 2 Sabores )
150	2025-11-30 19:16:55.087081+00	Henrique	Alto da XV	Refri, Chá ou Suco
151	2025-12-01 16:32:40.099603+00	Arielle	Ahu	Cascão Unitário
152	2025-12-01 16:35:05.648926+00	Sthefani	Ahu	Waffle de Liege
153	2025-12-01 16:35:45.156308+00	Sthefani	Ahu	Nutella - 40gr
154	2025-12-01 16:35:56.578836+00	Sthefani	Ahu	Morango - 35gr
155	2025-12-01 16:41:04.022988+00	Sthefani	Ahu	Refri, Chá ou Suco
156	2025-12-01 17:49:28.662026+00	Anna Beatriz	Alto da XV	Refri, Chá ou Suco
157	2025-12-01 17:49:42.076181+00	Anna Beatriz	Alto da XV	Brownie
158	2025-12-01 20:24:28.413125+00	Sthefani	Ahu	Latte
159	2025-12-01 20:24:43.09779+00	Sthefani	Ahu	Paçoca - 1un
160	2025-12-02 16:03:11.473896+00	Anna Beatriz	Alto da XV	Médio ( até 2 Sabores )
161	2025-12-02 16:03:22.644389+00	Anna Beatriz	Alto da XV	Refri, Chá ou Suco
162	2025-12-02 16:11:19.600177+00	Talita	Alto da XV	Sanduíche de Pernil
163	2025-12-02 16:11:34.810579+00	Talita	Alto da XV	Refri, Chá ou Suco
164	2025-12-02 16:36:21.960892+00	Arielle	Ahu	Refri, Chá ou Suco
165	2025-12-02 16:37:59.847689+00	Henrique	Ahu	Refri, Chá ou Suco
166	2025-12-02 17:15:51.133833+00	Henrique	Ahu	Pequeno ( 1 Sabor )
167	2025-12-03 16:03:32.265934+00	Talita	Alto da XV	Refri, Chá ou Suco
168	2025-12-03 17:03:36.775736+00	Lidiane	Alto da XV	Refri, Chá ou Suco
169	2025-12-03 17:40:04.527741+00	Lidiane	Alto da XV	COMBO SEGUNDA - Nutella e Morango
170	2025-12-03 17:55:27.260889+00	Anna Beatriz	Alto da XV	Médio ( até 2 Sabores )
171	2025-12-03 18:01:59.131483+00	Marina	Ahu	Água
172	2025-12-04 15:39:39.35117+00	Sthefani	Ahu	Capuccino Brasileiro
173	2025-12-04 16:04:06.014241+00	Talita	Alto da XV	Refri, Chá ou Suco
174	2025-12-04 16:21:58.565867+00	Marina	Alto da XV	Sanduíche de Mortadela
175	2025-12-04 16:22:08.495788+00	Marina	Alto da XV	Refri, Chá ou Suco
176	2025-12-04 18:04:18.469374+00	Anna Beatriz	Alto da XV	Refri, Chá ou Suco
177	2025-12-04 18:04:34.752708+00	Anna Beatriz	Alto da XV	Sanduíche de Mortadela
178	2025-12-04 19:30:46.862865+00	Sthefani	Ahu	Refri, Chá ou Suco
179	2025-12-05 15:33:26.759942+00	Marina	Alto da XV	Refri, Chá ou Suco
180	2025-12-05 15:46:48.257295+00	Sthefani	Ahu	Pote 480ml
181	2025-12-05 15:54:15.612381+00	Arielle	Alto da XV	Pote 480ml
182	2025-12-05 16:09:38.41784+00	Talita	Alto da XV	Refri, Chá ou Suco
183	2025-12-05 16:43:06.078215+00	Sthefani	Ahu	Sanduíche de Frango
184	2025-12-05 16:52:33.155757+00	Marina	Ahu	Refri, Chá ou Suco
185	2025-12-05 17:00:07.971792+00	Lidiane	Alto da XV	Sanduíche de Mortadela
186	2025-12-05 17:11:32.187741+00	Lidiane	Alto da XV	Refri, Chá ou Suco
187	2025-12-05 18:15:43.712689+00	Talita	Alto da XV	Pequeno ( 1 Sabor )
188	2025-12-05 21:26:40.778492+00	Arielle	Alto da XV	Caramel - Latte
189	2025-12-06 18:30:12.343025+00	Anna Beatriz	Alto da XV	Sanduíche de Frango
190	2025-12-06 19:51:18.392858+00	Anna Beatriz	Alto da XV	Pote 480ml
191	2025-12-06 19:51:28.961516+00	Anna Beatriz	Alto da XV	Pote 480ml
192	2025-12-07 14:58:22.185125+00	Sthefani	Ahu	Latte
193	2025-12-07 17:47:43.852054+00	Anna Beatriz	Alto da XV	Médio ( até 2 Sabores )
194	2025-12-07 17:47:57.390407+00	Anna Beatriz	Alto da XV	Refri, Chá ou Suco
195	2025-12-08 15:35:57.728784+00	Arielle	Ahu	Brownie
196	2025-12-08 17:35:34.500266+00	Lidiane	Alto da XV	Refri, Chá ou Suco
197	2025-12-08 18:02:06.360514+00	Anna Beatriz	Alto da XV	Médio ( até 2 Sabores )
198	2025-12-08 18:16:55.624636+00	Talita	Alto da XV	Pequeno ( 1 Sabor )
199	2025-12-08 18:30:11.329457+00	Arielle	Ahu	Refri, Chá ou Suco
206	2025-12-09 14:47:26.474625+00	Fabiana	Batel	Refri, Chá ou Suco
207	2025-12-09 16:09:03.210527+00	Talita	Alto da XV	Sanduíche de Parma
208	2025-12-09 16:22:55.703456+00	Fabiana	Batel	Médio ( até 2 Sabores )
210	2025-12-09 18:27:12.655724+00	Marina	Alto da XV	Refri, Chá ou Suco
211	2025-12-09 18:58:05.586122+00	Henrique	Alto da XV	Pequeno ( 1 Sabor )
212	2025-12-09 19:29:39.75868+00	Fabiana	Batel	Pote 480ml
213	2025-12-10 17:54:34.707282+00	Anna Beatriz	Alto da XV	Médio ( até 2 Sabores )
214	2025-12-10 18:17:56.422441+00	Arielle	Ahu	Refri, Chá ou Suco
215	2025-12-10 19:21:34.395446+00	Henrique	Ahu	Água
216	2025-12-10 22:31:57.802214+00	Arielle	Ahu	Brownie
218	2025-12-11 14:11:48.983381+00	Henrique	Alto da XV	Waffle de Liege
219	2025-12-12 16:20:43.827086+00	Talita	Alto da XV	Refri, Chá ou Suco
220	2025-12-12 16:21:09.225087+00	Talita	Alto da XV	Sanduíche de Parma
221	2025-12-12 18:02:00.112898+00	Arielle	Ahu	Refri, Chá ou Suco
222	2025-12-13 15:03:18.921112+00	Sthefani	Ahu	Latte
223	2025-12-13 15:15:14.393077+00	Arielle	Ahu	Nutella - 40gr
224	2025-12-13 17:01:14.133914+00	Lidiane	Alto da XV	Sanduíche de Frango
225	2025-12-13 17:07:31.361172+00	Lidiane	Alto da XV	Refri, Chá ou Suco
226	2025-12-13 17:31:18.295911+00	Sthefani	Ahu	Refri, Chá ou Suco
227	2025-12-13 17:41:52.352629+00	Henrique	Ahu	Refri, Chá ou Suco
228	2025-12-13 19:28:17.296757+00	Henrique	Ahu	Refri, Chá ou Suco
229	2025-12-14 16:32:02.550453+00	Lidiane	Alto da XV	Sanduíche de Parma
230	2025-12-14 16:42:15.411964+00	Lidiane	Alto da XV	Refri, Chá ou Suco
231	2025-12-14 17:14:00.162823+00	Anna Beatriz	Alto da XV	Pequeno ( 1 Sabor )
232	2025-12-14 17:14:13.442663+00	Anna Beatriz	Alto da XV	Refri, Chá ou Suco
233	2025-12-14 18:01:18.347684+00	Marina	Ahu	Água
234	2025-12-14 18:44:52.704177+00	Sthefani	Ahu	Refri, Chá ou Suco
235	2025-12-14 18:45:38.243859+00	Sthefani	Ahu	Latte
236	2025-12-14 19:03:07.173063+00	Henrique	Ahu	Água
237	2025-12-15 15:48:13.241291+00	Fabiana	Batel	Refri, Chá ou Suco
238	2025-12-15 17:32:38.038167+00	Lidiane	Alto da XV	Refri, Chá ou Suco
239	2025-12-15 17:40:24.466803+00	Fabiana	Batel	Médio ( até 2 Sabores )
240	2025-12-15 17:44:29.961064+00	Anna Beatriz	Alto da XV	Sanduíche de Mortadela
241	2025-12-15 17:58:57.959914+00	Arielle	Ahu	Água
242	2025-12-15 18:39:18.813025+00	Arielle	Ahu	Refri, Chá ou Suco
243	2025-12-16 12:33:34.9998+00	Talita	Alto da XV	Refri, Chá ou Suco
244	2025-12-16 15:23:39.005873+00	Sthefani	Ahu	Café Passado c/ Leite
245	2025-12-16 15:38:05.128081+00	Fabiana	Batel	Refri, Chá ou Suco
246	2025-12-16 17:35:04.570506+00	Fabiana	Batel	Pequeno ( 1 Sabor )
247	2025-12-16 17:38:49.059569+00	Sthefani	Ahu	Refri, Chá ou Suco
248	2025-12-17 16:36:35.641317+00	Talita	Alto da XV	Refri, Chá ou Suco
249	2025-12-17 16:36:49.819421+00	Fabiana	Batel	Refri, Chá ou Suco
250	2025-12-17 16:37:09.306913+00	Talita	Alto da XV	Sanduíche de Pernil
251	2025-12-17 17:34:06.904004+00	Lidiane	Alto da XV	Refri, Chá ou Suco
252	2025-12-17 17:39:21.303916+00	Anna Beatriz	Alto da XV	Brownie
253	2025-12-17 19:00:14.151037+00	Fabiana	Batel	Médio ( até 2 Sabores )
254	2025-12-18 14:48:32.604622+00	Sthefani	Ahu	Latte
255	2025-12-18 15:26:41.460447+00	Fabiana	Batel	Refri, Chá ou Suco
256	2025-12-18 16:58:10.871967+00	Talita	Alto da XV	Refri, Chá ou Suco
257	2025-12-18 16:58:34.052456+00	Talita	Alto da XV	Sanduíche de Parma
258	2025-12-18 17:17:17.201416+00	Sthefani	Ahu	Refri, Chá ou Suco
259	2025-12-18 17:33:59.281332+00	Lidiane	Alto da XV	Refri, Chá ou Suco
260	2025-12-18 18:12:41.696235+00	Lidiane	Alto da XV	Médio ( até 2 Sabores )
261	2025-12-19 12:02:32.108737+00	Talita	Alto da XV	Refri, Chá ou Suco
262	2025-12-19 14:26:57.535219+00	Fabiana	Batel	Refri, Chá ou Suco
263	2025-12-19 15:56:35.687509+00	Talita	Alto da XV	Refri, Chá ou Suco
264	2025-12-19 16:00:19.226918+00	Henrique	Ahu	Água
265	2025-12-19 16:25:26.713131+00	Arielle	Ahu	Gelato Carmella - 60gr
266	2025-12-19 17:17:39.937336+00	Sthefani	Ahu	Refri, Chá ou Suco
267	2025-12-19 17:32:18.623136+00	Lidiane	Alto da XV	Refri, Chá ou Suco
268	2025-12-19 17:49:23.615621+00	Arielle	Ahu	Pote 480ml
269	2025-12-19 17:49:37.134041+00	Arielle	Ahu	Refri, Chá ou Suco
270	2025-12-19 18:25:15.852612+00	Fabiana	Batel	Médio ( até 2 Sabores )
271	2025-12-20 15:30:53.651617+00	Lidiane	Alto da XV	Sanduíche de Mortadela
272	2025-12-20 15:31:10.376668+00	Lidiane	Alto da XV	Refri, Chá ou Suco
273	2025-12-20 15:49:22.32909+00	Anna Beatriz	Alto da XV	Sanduíche de Mortadela
274	2025-12-20 15:49:46.857968+00	Anna Beatriz	Alto da XV	Refri, Chá ou Suco
275	2025-12-20 16:02:24.661278+00	Sthefani	Ahu	Refri, Chá ou Suco
276	2025-12-20 16:02:36.58394+00	Sthefani	Ahu	Refri, Chá ou Suco
277	2025-12-20 16:18:35.53616+00	Fabiana	Batel	Refri, Chá ou Suco
278	2025-12-20 18:20:01.804279+00	Arielle	Ahu	Refri, Chá ou Suco
279	2025-12-21 16:30:59.680652+00	Arielle	Ahu	Refri, Chá ou Suco
280	2025-12-21 16:31:11.048847+00	Arielle	Ahu	Gelato Carmella - 60gr
281	2025-12-21 16:31:24.270322+00	Arielle	Ahu	Cascão Unitário
282	2025-12-21 16:32:21.5804+00	Lidiane	Alto da XV	Sanduíche de Carne
283	2025-12-21 16:41:24.631357+00	Lidiane	Alto da XV	Refri, Chá ou Suco
284	2025-12-21 16:53:30.939308+00	Anna Beatriz	Alto da XV	Refri, Chá ou Suco
285	2025-12-21 17:09:45.016501+00	Anna Beatriz	Alto da XV	Pote 480ml
286	2025-12-21 21:37:42.39364+00	Henrique	Ahu	Água
287	2025-12-21 21:37:55.739604+00	Henrique	Ahu	Refri, Chá ou Suco
288	2025-12-22 16:47:20.521184+00	Talita	Alto da XV	Refri, Chá ou Suco
289	2025-12-22 17:27:55.210676+00	Sthefani	Ahu	Latte
290	2025-12-22 17:33:30.928822+00	Lidiane	Alto da XV	Refri, Chá ou Suco
291	2025-12-22 17:53:48.193777+00	Anna Beatriz	Alto da XV	Refri, Chá ou Suco
292	2025-12-22 18:18:19.042952+00	Lidiane	Alto da XV	Médio ( até 2 Sabores )
293	2025-12-22 18:34:17.708277+00	Arielle	Ahu	Refri, Chá ou Suco
294	2025-12-22 18:53:44.234865+00	Sthefani	Ahu	Quiche Caprese
295	2025-12-22 18:53:55.987818+00	Sthefani	Ahu	Refri, Chá ou Suco
296	2025-12-22 21:56:46.884391+00	Arielle	Ahu	Brownie
297	2025-12-22 21:57:03.393288+00	Arielle	Ahu	Brownie
298	2025-12-22 22:50:14.153046+00	Arielle	Ahu	Nutella - 40gr
299	2025-12-22 22:55:03.94095+00	Sthefani	Ahu	Nutella - 40gr
300	2025-12-22 22:55:15.404936+00	Sthefani	Ahu	Nutella - 40gr
301	2025-12-22 22:55:27.443078+00	Sthefani	Ahu	Nutella - 40gr
302	2025-12-22 22:55:39.038744+00	Sthefani	Ahu	Nutella - 40gr
303	2025-12-28 21:42:14.167034+00	Henrique	Ahu	Pequeno ( 1 Sabor )
304	2026-01-02 11:52:12.433273+00	Talita	Alto da XV	Refri, Chá ou Suco
305	2026-01-02 15:49:40.310637+00	Sthefani	Ahu	Mocha
306	2026-01-02 17:07:13.858683+00	Talita	Alto da XV	Refri, Chá ou Suco
307	2026-01-02 17:32:53.855677+00	Sthefani	Ahu	Refri, Chá ou Suco
308	2026-01-02 18:16:30.843333+00	Talita	Alto da XV	Médio ( até 2 Sabores )
309	2026-01-02 18:16:46.362066+00	Talita	Alto da XV	Pequeno ( 1 Sabor )
310	2026-01-02 18:31:25.559391+00	Arielle	Ahu	Refri, Chá ou Suco
311	2026-01-03 14:11:54.231885+00	Henrique	Alto da XV	Refri, Chá ou Suco
312	2026-01-03 14:12:19.834942+00	Henrique	Ahu	Água
313	2026-01-03 14:12:29.695973+00	Henrique	Ahu	Refri, Chá ou Suco
314	2026-01-03 15:21:10.553968+00	Lidiane	Alto da XV	Refri, Chá ou Suco
315	2026-01-03 15:54:29.308278+00	Sthefani	Ahu	Latte
316	2026-01-03 16:10:13.489798+00	Henrique	Ahu	Pote 480ml
317	2026-01-03 16:10:31.905891+00	Henrique	Ahu	Pote 480ml
917	2026-03-28 21:57:28.564723+00	Sthefani	Ahu	Latte
318	2026-01-03 16:45:36.179513+00	Lidiane	Alto da XV	Refri, Chá ou Suco
319	2026-01-03 16:55:20.999098+00	Sthefani	Ahu	Refri, Chá ou Suco
320	2026-01-03 17:21:11.315048+00	Anna Beatriz	Alto da XV	Refri, Chá ou Suco
321	2026-01-03 17:54:33.607751+00	Arielle	Ahu	Refri, Chá ou Suco
322	2026-01-03 22:22:12.602213+00	Sthefani	Ahu	Refri, Chá ou Suco
323	2026-01-03 22:22:23.219213+00	Sthefani	Ahu	Refri, Chá ou Suco
324	2026-01-03 22:23:27.712163+00	Sthefani	Ahu	Refri, Chá ou Suco
325	2026-01-04 16:32:44.954024+00	Lidiane	Alto da XV	Refri, Chá ou Suco
326	2026-01-04 17:39:25.044158+00	Arielle	Ahu	Refri, Chá ou Suco
327	2026-01-05 16:12:26.636573+00	Arielle	Ahu	Nutella - 40gr
328	2026-01-05 16:20:27.50725+00	Talita	Alto da XV	Refri, Chá ou Suco
329	2026-01-05 16:20:51.790497+00	Talita	Alto da XV	Sanduíche de Parma
330	2026-01-05 16:27:01.48201+00	Arielle	Ahu	Refri, Chá ou Suco
331	2026-01-05 17:31:50.447603+00	Sthefani	Ahu	Refri, Chá ou Suco
332	2026-01-05 17:33:34.235921+00	Lidiane	Alto da XV	Refri, Chá ou Suco
333	2026-01-05 18:31:51.536232+00	Arielle	Ahu	Refri, Chá ou Suco
334	2026-01-06 15:27:13.625235+00	Henrique	Ahu	Refri, Chá ou Suco
335	2026-01-06 15:58:49.464335+00	Talita	Alto da XV	Refri, Chá ou Suco
336	2026-01-06 18:58:20.035422+00	Sthefani	Ahu	Mocha
337	2026-01-07 13:47:49.762352+00	Arielle	Ahu	Sanduíche de Pernil
338	2026-01-07 13:53:47.230165+00	Arielle	Ahu	Refri, Chá ou Suco
339	2026-01-07 17:30:26.539339+00	Lidiane	Alto da XV	Refri, Chá ou Suco
340	2026-01-07 17:55:17.527993+00	Arielle	Ahu	Refri, Chá ou Suco
341	2026-01-07 18:07:22.234468+00	Lidiane	Alto da XV	Pequeno ( 1 Sabor )
342	2026-01-07 19:20:43.491013+00	Henrique	Ahu	Refri, Chá ou Suco
343	2026-01-08 17:59:52.576709+00	Anna Beatriz	Alto da XV	Médio ( até 2 Sabores )
344	2026-01-08 20:19:03.169106+00	Henrique	Ahu	Pequeno ( 1 Sabor )
345	2026-01-08 20:19:26.619228+00	Henrique	Ahu	Água
346	2026-01-08 20:19:36.700602+00	Henrique	Ahu	Refri, Chá ou Suco
347	2026-01-09 14:37:04.414879+00	Arielle	Ahu	Sanduíche de Carne
348	2026-01-09 15:58:34.969722+00	Talita	Alto da XV	Refri, Chá ou Suco
349	2026-01-09 15:59:05.041408+00	Talita	Alto da XV	Sanduíche de Parma
350	2026-01-09 17:14:52.78817+00	Sthefani	Ahu	Refri, Chá ou Suco
351	2026-01-09 17:55:56.977692+00	Henrique	Ahu	Pequeno ( 1 Sabor )
352	2026-01-09 18:08:00.948393+00	Arielle	Ahu	Água
353	2026-01-09 18:08:12.429226+00	Arielle	Ahu	Cascão Unitário
354	2026-01-09 18:08:24.60596+00	Arielle	Ahu	Gelato Carmella - 60gr
355	2026-01-09 18:10:05.858102+00	Lidiane	Alto da XV	Refri, Chá ou Suco
356	2026-01-10 16:30:28.100629+00	Lidiane	Alto da XV	Refri, Chá ou Suco
357	2026-01-10 16:58:34.005053+00	Anna Beatriz	Alto da XV	Refri, Chá ou Suco
358	2026-01-10 17:40:08.684528+00	Arielle	Ahu	Refri, Chá ou Suco
359	2026-01-10 18:27:15.516688+00	Sthefani	Ahu	Água
360	2026-01-10 18:37:41.472924+00	Henrique	Ahu	Pequeno ( 1 Sabor )
361	2026-01-10 18:37:49.701709+00	Henrique	Ahu	Pequeno ( 1 Sabor )
362	2026-01-10 19:23:04.488361+00	Sthefani	Ahu	Waffle de Liege
363	2026-01-10 19:23:21.859497+00	Sthefani	Ahu	Nutella - 40gr
364	2026-01-10 21:57:50.321904+00	Arielle	Ahu	COMBO SEGUNDA - Nutella e Morango
365	2026-01-10 21:57:59.315623+00	Arielle	Ahu	Waffle de Liege
366	2026-01-10 21:58:13.541219+00	Arielle	Ahu	Nutella - 40gr
367	2026-01-10 22:06:12.445946+00	Sthefani	Ahu	Sanduíche de Pernil
368	2026-01-11 16:58:58.71269+00	Lidiane	Alto da XV	Refri, Chá ou Suco
369	2026-01-11 16:59:24.948657+00	Lidiane	Alto da XV	Sanduíche de Mortadela
370	2026-01-11 17:11:14.2124+00	Anna Beatriz	Alto da XV	Sanduíche de Mortadela
371	2026-01-11 17:11:26.360004+00	Anna Beatriz	Alto da XV	Refri, Chá ou Suco
372	2026-01-12 15:56:53.679046+00	Talita	Alto da XV	Refri, Chá ou Suco
373	2026-01-12 17:14:42.727747+00	Talita	Alto da XV	Pequeno ( 1 Sabor )
374	2026-01-12 17:33:49.572858+00	Lidiane	Alto da XV	Refri, Chá ou Suco
375	2026-01-12 17:34:59.716072+00	Sthefani	Ahu	Refri, Chá ou Suco
376	2026-01-12 18:01:30.865283+00	Anna Beatriz	Alto da XV	Médio ( até 2 Sabores )
377	2026-01-12 18:39:27.557383+00	Lidiane	Alto da XV	Pequeno ( 1 Sabor )
378	2026-01-13 15:58:34.012712+00	Talita	Alto da XV	Refri, Chá ou Suco
379	2026-01-14 14:04:33.592414+00	Arielle	Ahu	Refri, Chá ou Suco
380	2026-01-14 14:38:10.757432+00	Arielle	Ahu	Sanduíche de Frango
381	2026-01-14 14:39:24.687276+00	Arielle	Ahu	Refri, Chá ou Suco
382	2026-01-14 15:06:28.764869+00	Arielle	Ahu	Refri, Chá ou Suco
383	2026-01-14 16:07:29.584732+00	Talita	Alto da XV	Refri, Chá ou Suco
384	2026-01-14 16:34:20.012244+00	Lidiane	Alto da XV	Refri, Chá ou Suco
385	2026-01-14 16:43:27.492291+00	Anna Beatriz	Alto da XV	Pequeno ( 1 Sabor )
386	2026-01-14 17:12:07.685408+00	Lidiane	Alto da XV	Médio ( até 2 Sabores )
387	2026-01-14 17:18:21.301008+00	Talita	Alto da XV	Pequeno ( 1 Sabor )
388	2026-01-14 18:15:42.127187+00	Marina	Ahu	Água
389	2026-01-14 19:12:51.148378+00	Marina	Ahu	Água
390	2026-01-14 21:55:05.220263+00	Arielle	Ahu	Refri, Chá ou Suco
391	2026-01-15 12:28:53.608516+00	Henrique	Alto da XV	Waffle de Liege
392	2026-01-15 12:29:08.732995+00	Henrique	Alto da XV	Mapple Syrup - 10gr
393	2026-01-15 12:29:19.196444+00	Henrique	Alto da XV	Refri, Chá ou Suco
394	2026-01-15 15:16:17.862634+00	Sthefani	Ahu	Gelato Carmella - 60gr
395	2026-01-15 16:34:04.991319+00	Talita	Alto da XV	Refri, Chá ou Suco
396	2026-01-15 16:34:29.09213+00	Talita	Alto da XV	Sanduíche de Parma
397	2026-01-15 17:26:13.196921+00	Marina	Ahu	Água
398	2026-01-15 17:33:06.721353+00	Lidiane	Alto da XV	Sanduíche de Mortadela
399	2026-01-15 17:33:25.989287+00	Lidiane	Alto da XV	Refri, Chá ou Suco
400	2026-01-15 18:51:50.63473+00	Lidiane	Alto da XV	Pequeno ( 1 Sabor )
401	2026-01-16 15:59:21.332377+00	Talita	Alto da XV	Refri, Chá ou Suco
402	2026-01-16 16:05:59.462784+00	Marina	Alto da XV	Refri, Chá ou Suco
403	2026-01-16 16:30:33.352662+00	Lidiane	Alto da XV	Sanduíche de Mortadela
404	2026-01-16 16:35:46.865065+00	Lidiane	Alto da XV	Refri, Chá ou Suco
405	2026-01-16 17:03:01.849253+00	Talita	Alto da XV	Médio ( até 2 Sabores )
406	2026-01-16 17:33:39.350881+00	Arielle	Alto da XV	Refri, Chá ou Suco
408	2026-01-16 18:31:59.987664+00	Tielly	Batel	Salgados Pequeno PREMIUM 8un
409	2026-01-16 18:32:22.96574+00	Tielly	Batel	Refri, Chá ou Suco
412	2026-01-16 19:19:16.951863+00	Henrique	Batel	Refri, Chá ou Suco
413	2026-01-16 19:22:57.504488+00	Henrique	Batel	Refri, Chá ou Suco
414	2026-01-16 19:23:08.482445+00	Henrique	Batel	Salgados Grande PREMIUM 12un
415	2026-01-16 21:15:19.818001+00	Endryw	Batel	Grande ( 3 bolas )
416	2026-01-16 22:19:37.289932+00	Henrique	Ahu	Refri, Chá ou Suco
417	2026-01-17 16:20:55.014112+00	Anna Beatriz	Alto da XV	Pote 480ml
418	2026-01-17 18:33:03.302466+00	Arielle	Ahu	Refri, Chá ou Suco
419	2026-01-17 18:33:27.188157+00	Arielle	Ahu	Refri, Chá ou Suco
420	2026-01-17 20:14:15.859977+00	Arielle	Ahu	Pote 480ml
421	2026-01-18 16:12:10.184112+00	Henrique	Alto da XV	Médio ( até 2 Sabores )
422	2026-01-18 16:31:23.060502+00	Arielle	Alto da XV	Refri, Chá ou Suco
423	2026-01-18 17:03:19.484789+00	Sthefani	Ahu	Refri, Chá ou Suco
424	2026-01-18 18:41:52.682174+00	Arielle	Alto da XV	Médio ( até 2 Sabores )
425	2026-01-18 18:42:08.057723+00	Sthefani	Ahu	Pote 480ml
426	2026-01-19 15:06:51.687624+00	Arielle	Ahu	Waffle de Liege
427	2026-01-19 15:28:27.456043+00	Sthefani	Ahu	Waffle de Liege
428	2026-01-19 15:28:43.367906+00	Sthefani	Ahu	Doce de Leite - 40gr
429	2026-01-19 16:10:18.179497+00	Talita	Alto da XV	Refri, Chá ou Suco
430	2026-01-19 17:30:17.356574+00	Endryw	Batel	Médio ( 2 bolas )
431	2026-01-19 17:34:26.421949+00	Lidiane	Alto da XV	Refri, Chá ou Suco
432	2026-01-19 17:40:51.738594+00	Anna Beatriz	Alto da XV	Refri, Chá ou Suco
433	2026-01-19 18:42:07.610466+00	Arielle	Ahu	Refri, Chá ou Suco
434	2026-01-19 18:42:21.406676+00	Arielle	Ahu	Banana - 35gr
435	2026-01-19 19:01:09.341387+00	Tielly	Batel	Café com Leite
436	2026-01-19 20:07:29.680797+00	Endryw	Batel	Refri, Chá ou Suco
437	2026-01-19 20:07:47.424252+00	Endryw	Batel	Salgados Pequeno 8un
438	2026-01-19 20:34:36.554018+00	Henrique	Batel	Salgados Grande 12un
439	2026-01-19 20:34:50.803447+00	Henrique	Batel	Refri, Chá ou Suco
440	2026-01-19 20:35:02.320512+00	Henrique	Batel	Refri, Chá ou Suco
441	2026-01-20 15:11:28.778843+00	Tielly	Batel	Salgados Pequeno 8un
442	2026-01-20 15:11:55.578171+00	Tielly	Batel	Refri, Chá ou Suco
443	2026-01-20 16:01:00.261221+00	Talita	Alto da XV	Refri, Chá ou Suco
444	2026-01-20 16:01:26.054652+00	Talita	Alto da XV	Sanduíche de Parma
445	2026-01-20 17:09:21.169149+00	Talita	Alto da XV	Médio ( até 2 Sabores )
446	2026-01-20 18:17:31.681483+00	Arielle	Alto da XV	Refri, Chá ou Suco
447	2026-01-20 19:12:21.595088+00	Tielly	Batel	Pequeno ( 1 bola )
448	2026-01-21 15:45:11.774519+00	Tielly	Batel	Café com Leite
449	2026-01-21 16:21:39.191483+00	Talita	Alto da XV	Refri, Chá ou Suco
450	2026-01-21 19:02:07.089513+00	Tielly	Batel	Cup Noodles
451	2026-01-22 15:54:19.133737+00	Talita	Alto da XV	Refri, Chá ou Suco
452	2026-01-22 16:35:50.400965+00	Lidiane	Alto da XV	Refri, Chá ou Suco
453	2026-01-22 16:36:13.830437+00	Lidiane	Alto da XV	Sanduíche de Mortadela
454	2026-01-22 19:20:05.060254+00	Sthefani	Ahu	Refri, Chá ou Suco
455	2026-01-23 15:48:15.415182+00	Talita	Alto da XV	Refri, Chá ou Suco
456	2026-01-23 15:48:44.561574+00	Talita	Alto da XV	Sanduíche de Parma
457	2026-01-23 17:05:22.822848+00	Talita	Alto da XV	Médio ( até 2 Sabores )
458	2026-01-23 17:52:20.3406+00	Lidiane	Alto da XV	Refri, Chá ou Suco
459	2026-01-23 18:08:00.790726+00	Sthefani	Ahu	Refri, Chá ou Suco
460	2026-01-24 16:04:02.131721+00	Arielle	Alto da XV	Refri, Chá ou Suco
461	2026-01-24 18:29:38.307473+00	Sthefani	Ahu	Mocha
462	2026-01-24 21:58:41.890541+00	Sthefani	Ahu	Refri, Chá ou Suco
463	2026-01-24 21:58:51.897261+00	Sthefani	Ahu	Refri, Chá ou Suco
464	2026-01-25 21:02:07.969598+00	Sthefani	Ahu	Latte
465	2026-01-26 15:56:13.539559+00	Sthefani	Ahu	COMBO SEGUNDA - Nutella e Morango
466	2026-01-26 17:52:36.126274+00	Marina	Alto da XV	Refri, Chá ou Suco
467	2026-01-26 17:52:52.957952+00	Marina	Alto da XV	Refri, Chá ou Suco
468	2026-01-26 17:53:05.065608+00	Marina	Alto da XV	Refri, Chá ou Suco
469	2026-01-26 19:39:43.867268+00	Henrique	Ahu	Refri, Chá ou Suco
470	2026-01-27 14:05:06.148446+00	Arielle	Ahu	Pote 480ml
471	2026-01-27 14:05:19.364333+00	Arielle	Ahu	COMBO SEGUNDA - Nutella e Morango
472	2026-01-27 15:48:32.669695+00	Talita	Alto da XV	Refri, Chá ou Suco
473	2026-01-27 17:39:58.723674+00	Sthefani	Ahu	Refri, Chá ou Suco
474	2026-01-27 18:52:24.599772+00	Sthefani	Ahu	Vanilla - Latte
475	2026-01-28 16:43:32.609839+00	Henrique	Ahu	Água
476	2026-01-29 12:05:22.074662+00	Henrique	Alto da XV	Waffle de Liege
477	2026-01-29 12:05:31.872027+00	Henrique	Alto da XV	Nutella - 40gr
478	2026-01-29 14:38:08.558933+00	Sthefani	Ahu	Waffle de Liege
479	2026-01-29 17:31:06.691008+00	Lidiane	Alto da XV	Sanduíche de Parma
480	2026-01-29 17:31:25.126992+00	Lidiane	Alto da XV	Refri, Chá ou Suco
481	2026-01-29 18:20:48.870575+00	Henrique	Batel	Refri, Chá ou Suco
482	2026-01-30 15:58:52.50166+00	Talita	Alto da XV	Refri, Chá ou Suco
483	2026-01-30 16:52:00.632478+00	Talita	Alto da XV	Pequeno ( 1 Sabor )
484	2026-01-30 17:46:14.610811+00	Henrique	Alto da XV	Água
485	2026-01-30 17:46:33.059709+00	Henrique	Ahu	Refri, Chá ou Suco
486	2026-01-30 18:36:12.687976+00	Arielle	Ahu	Refri, Chá ou Suco
487	2026-01-31 14:19:20.715913+00	Henrique	Alto da XV	Refri, Chá ou Suco
488	2026-01-31 16:11:34.267065+00	Henrique	Batel	Água
489	2026-01-31 16:39:52.433008+00	Sthefani	Ahu	Refri, Chá ou Suco
490	2026-02-01 16:32:48.906841+00	Lidiane	Alto da XV	Refri, Chá ou Suco
491	2026-02-01 16:53:16.003913+00	Anna Beatriz	Alto da XV	Sanduíche de Carne
492	2026-02-02 16:07:14.611354+00	Talita	Alto da XV	Refri, Chá ou Suco
493	2026-02-02 16:07:40.822353+00	Talita	Alto da XV	Sanduíche de Parma
494	2026-02-02 17:30:32.419784+00	Lidiane	Alto da XV	Sanduíche de Carne
495	2026-02-02 17:30:49.687151+00	Lidiane	Alto da XV	Refri, Chá ou Suco
496	2026-02-02 18:35:34.294214+00	Lidiane	Alto da XV	Pequeno ( 1 Sabor )
497	2026-02-02 19:06:11.473969+00	Arielle	Ahu	Refri, Chá ou Suco
498	2026-02-02 19:12:53.013936+00	Marina	Alto da XV	Refri, Chá ou Suco
499	2026-02-02 20:55:50.092033+00	Tielly	Batel	Salgados Pequeno 8un
500	2026-02-02 20:56:19.691718+00	Tielly	Batel	Refri, Chá ou Suco
501	2026-02-02 21:01:17.903326+00	Tielly	Batel	Pequeno ( 1 bola )
502	2026-02-03 15:05:32.952879+00	Endryw	Batel	Médio ( 2 bolas )
503	2026-02-03 15:10:40.217511+00	Tielly	Batel	Salgados Pequeno 8un
504	2026-02-03 15:35:58.689168+00	Tielly	Batel	Refri, Chá ou Suco
505	2026-02-03 16:39:22.29717+00	Talita	Alto da XV	Refri, Chá ou Suco
506	2026-02-03 17:12:34.151807+00	Endryw	Batel	Refri, Chá ou Suco
507	2026-02-03 17:13:00.448552+00	Endryw	Batel	Espresso c/ Leite - P
508	2026-02-03 17:15:49.083189+00	Endryw	Batel	Waffle de Liege
509	2026-02-03 17:16:06.212244+00	Endryw	Batel	Nutella - 40gr
510	2026-02-03 17:16:24.955308+00	Endryw	Batel	Mini Óreo - 30gr / 9 bolachas
511	2026-02-03 17:16:41.837174+00	Endryw	Batel	Sanduíche de Mortadela
512	2026-02-03 17:17:02.438914+00	Endryw	Batel	Refri, Chá ou Suco
513	2026-02-03 17:17:39.916826+00	Endryw	Batel	Waffle de Liege
514	2026-02-03 17:17:56.070379+00	Endryw	Batel	Nutella - 40gr
515	2026-02-03 17:18:10.262534+00	Endryw	Batel	Morango - 35gr
516	2026-02-03 17:18:29.899916+00	Endryw	Batel	Refri, Chá ou Suco
517	2026-02-03 17:18:48.994189+00	Endryw	Batel	Médio ( 2 bolas )
918	2026-03-29 17:13:45.476605+00	Sthefani	Ahu	Água
518	2026-02-03 17:18:59.930771+00	Endryw	Batel	Médio ( 2 bolas )
519	2026-02-03 18:04:31.282046+00	Sthefani	Ahu	Nutella - 40gr
520	2026-02-03 18:04:43.925924+00	Sthefani	Ahu	Refri, Chá ou Suco
521	2026-02-03 18:20:19.689445+00	Endryw	Batel	Brownie + Gelato
522	2026-02-03 18:28:49.75349+00	Endryw	Batel	Refri, Chá ou Suco
523	2026-02-03 18:32:39.71524+00	Tielly	Batel	Salgados Pequeno 8un
524	2026-02-03 18:32:58.091127+00	Tielly	Batel	Refri, Chá ou Suco
525	2026-02-03 18:37:34.670886+00	Arielle	Ahu	Nutella - 40gr
526	2026-02-04 14:36:42.81816+00	Endryw	Batel	Pequeno ( 1 bola )
527	2026-02-04 14:48:42.434318+00	Tielly	Batel	Salgados Pequeno 8un
528	2026-02-04 15:41:53.958123+00	Henrique	Alto da XV	Pequeno ( 1 Sabor )
529	2026-02-04 15:42:05.843161+00	Henrique	Alto da XV	Refri, Chá ou Suco
530	2026-02-04 16:50:40.175896+00	Talita	Alto da XV	Refri, Chá ou Suco
531	2026-02-04 17:18:36.776402+00	Endryw	Batel	Salgados Grande PREMIUM 12un
532	2026-02-04 17:19:07.875241+00	Endryw	Batel	Refri, Chá ou Suco
533	2026-02-04 17:36:15.231771+00	Endryw	Batel	Refri, Chá ou Suco
534	2026-02-04 18:17:45.776645+00	Tielly	Batel	Sanduíche de Frango
535	2026-02-04 18:18:12.297881+00	Tielly	Batel	Refri, Chá ou Suco
536	2026-02-04 18:39:44.557191+00	Lidiane	Alto da XV	Médio ( até 2 Sabores )
537	2026-02-04 20:15:23.620206+00	Endryw	Batel	Refri, Chá ou Suco
538	2026-02-04 20:15:40.695369+00	Endryw	Batel	Sanduíche de Carne
539	2026-02-04 20:58:57.513109+00	Endryw	Batel	Salgados Grande PREMIUM 12un
540	2026-02-04 20:59:11.427397+00	Endryw	Batel	Refri, Chá ou Suco
541	2026-02-05 12:11:19.631156+00	Henrique	Ahu	Refri, Chá ou Suco
542	2026-02-05 13:54:22.448346+00	Endryw	Batel	Pequeno ( 1 bola )
543	2026-02-05 15:28:37.97642+00	Endryw	Batel	Refri, Chá ou Suco
544	2026-02-05 16:02:04.560236+00	Talita	Alto da XV	Refri, Chá ou Suco
545	2026-02-05 16:02:05.499162+00	Tielly	Batel	Salgados Pequeno 8un
546	2026-02-05 17:24:56.851368+00	Endryw	Batel	Pequeno ( 1 bola )
547	2026-02-05 17:33:51.322381+00	Lidiane	Alto da XV	Refri, Chá ou Suco
548	2026-02-05 18:10:07.280534+00	Anna Beatriz	Alto da XV	Pote 480ml
549	2026-02-05 18:11:24.31342+00	Anna Beatriz	Alto da XV	Pote 480ml
550	2026-02-05 18:15:40.328975+00	Talita	Alto da XV	Pequeno ( 1 Sabor )
551	2026-02-05 18:17:57.889764+00	Anna Beatriz	Alto da XV	Médio ( até 2 Sabores )
552	2026-02-05 18:26:46.066035+00	Anna Beatriz	Alto da XV	Sanduíche de Carne
553	2026-02-05 18:35:07.346938+00	Lidiane	Alto da XV	Pequeno ( 1 Sabor )
554	2026-02-05 18:36:35.76065+00	Sthefani	Ahu	Refri, Chá ou Suco
555	2026-02-05 18:47:45.698056+00	Tielly	Batel	Cup Noodles
556	2026-02-05 18:49:51.814682+00	Tielly	Batel	Refri, Chá ou Suco
557	2026-02-05 18:50:24.78783+00	Endryw	Batel	Refri, Chá ou Suco
558	2026-02-05 20:18:30.778436+00	Endryw	Batel	Pequeno ( 1 bola )
559	2026-02-05 20:21:51.458142+00	Anna Beatriz	Alto da XV	Pote 480ml
560	2026-02-05 20:22:05.974326+00	Anna Beatriz	Alto da XV	Pote 480ml
561	2026-02-05 20:22:37.235166+00	Anna Beatriz	Alto da XV	Pote 480ml
562	2026-02-05 20:57:48.375779+00	Tielly	Batel	Pequeno ( 1 bola )
563	2026-02-06 15:02:37.655969+00	Endryw	Batel	Salgados Grande 12un
564	2026-02-06 15:02:54.482751+00	Endryw	Batel	Refri, Chá ou Suco
565	2026-02-06 15:19:35.928815+00	Tielly	Batel	Salgados Pequeno 8un
566	2026-02-06 16:10:59.430855+00	Endryw	Batel	Médio ( 2 bolas )
567	2026-02-06 16:45:53.58049+00	Talita	Alto da XV	Sanduíche de Parma
568	2026-02-06 16:50:16.637037+00	Talita	Alto da XV	Médio ( até 2 Sabores )
569	2026-02-06 17:49:57.817543+00	Lidiane	Alto da XV	Sanduíche de Parma
570	2026-02-06 17:50:16.291614+00	Lidiane	Alto da XV	Refri, Chá ou Suco
571	2026-02-06 18:12:58.14574+00	Endryw	Batel	Refri, Chá ou Suco
572	2026-02-06 18:27:54.147999+00	Henrique	Alto da XV	Refri, Chá ou Suco
573	2026-02-06 18:28:08.485108+00	Henrique	Alto da XV	Água
574	2026-02-06 18:32:22.880533+00	Henrique	Alto da XV	Refri, Chá ou Suco
575	2026-02-06 19:15:23.572915+00	Tielly	Batel	Salgados Pequeno 8un
576	2026-02-06 19:17:29.251916+00	Tielly	Batel	Refri, Chá ou Suco
577	2026-02-06 20:17:53.185657+00	Henrique	Batel	Salgados Pequeno PREMIUM 8un
578	2026-02-06 20:20:18.228806+00	Endryw	Batel	Médio ( 2 bolas )
579	2026-02-06 20:21:27.964324+00	Henrique	Batel	Refri, Chá ou Suco
580	2026-02-06 20:43:45.757047+00	Tielly	Batel	Salgados Pequeno 8un
581	2026-02-06 20:44:04.14373+00	Tielly	Batel	Salgados Pequeno 8un
582	2026-02-06 21:09:28.984034+00	Arielle	Ahu	Brownie + Gelato
583	2026-02-07 14:05:54.939029+00	Tielly	Batel	Refri, Chá ou Suco
584	2026-02-07 16:33:27.856208+00	Lidiane	Alto da XV	Refri, Chá ou Suco
585	2026-02-07 16:37:37.955268+00	Marina	Alto da XV	Refri, Chá ou Suco
586	2026-02-07 17:14:00.592429+00	Tielly	Batel	Pequeno ( 1 bola )
587	2026-02-07 17:31:54.807092+00	Henrique	Alto da XV	Refri, Chá ou Suco
588	2026-02-07 17:32:06.482614+00	Henrique	Alto da XV	Água
589	2026-02-07 17:59:37.329652+00	Tielly	Batel	Brownie
590	2026-02-07 19:45:15.04835+00	Henrique	Ahu	Pequeno ( 1 Sabor )
591	2026-02-08 15:21:44.897024+00	Marina	Alto da XV	Refri, Chá ou Suco
592	2026-02-08 16:31:29.051161+00	Sthefani	Ahu	Refri, Chá ou Suco
593	2026-02-09 15:12:41.360294+00	Tielly	Batel	Refri, Chá ou Suco
594	2026-02-09 15:53:16.240832+00	Talita	Alto da XV	Refri, Chá ou Suco
595	2026-02-09 18:15:37.872183+00	Tielly	Batel	Brownie
596	2026-02-09 18:23:14.325733+00	Henrique	Ahu	Água
597	2026-02-09 20:41:18.893375+00	Tielly	Batel	Salgados Pequeno 8un
598	2026-02-10 15:32:27.140097+00	Henrique	Alto da XV	Refri, Chá ou Suco
599	2026-02-10 16:04:47.116339+00	Talita	Alto da XV	Refri, Chá ou Suco
600	2026-02-10 18:01:00.051473+00	Arielle	Ahu	Brownie
601	2026-02-10 18:01:50.032605+00	Arielle	Ahu	Refri, Chá ou Suco
602	2026-02-10 18:21:29.257597+00	Arielle	Alto da XV	Refri, Chá ou Suco
603	2026-02-10 22:03:09.977725+00	Arielle	Alto da XV	Gelato Carmella - 60gr
604	2026-02-10 22:23:30.869718+00	Sthefani	Ahu	Refri, Chá ou Suco
605	2026-02-10 22:23:40.795184+00	Sthefani	Ahu	Refri, Chá ou Suco
606	2026-02-11 15:13:03.355809+00	Tielly	Batel	Refri, Chá ou Suco
607	2026-02-11 15:57:14.620948+00	Talita	Alto da XV	Refri, Chá ou Suco
608	2026-02-11 16:34:07.653856+00	Lidiane	Alto da XV	Sanduíche de Mortadela
609	2026-02-11 16:45:25.952738+00	Arielle	Ahu	Pote 480ml
610	2026-02-11 16:45:40.815614+00	Arielle	Ahu	Brownie
611	2026-02-11 17:33:51.341995+00	Lidiane	Alto da XV	Refri, Chá ou Suco
612	2026-02-11 17:52:16.717497+00	Arielle	Ahu	Cascão Unitário
613	2026-02-11 18:37:24.488276+00	Tielly	Batel	Refri, Chá ou Suco
614	2026-02-11 19:28:58.353072+00	Henrique	Ahu	Refri, Chá ou Suco
615	2026-02-12 15:49:41.034321+00	Talita	Alto da XV	Refri, Chá ou Suco
616	2026-02-12 15:50:00.461088+00	Talita	Alto da XV	Sanduíche de Parma
617	2026-02-12 16:03:20.322361+00	Lidiane	Alto da XV	Água
618	2026-02-12 18:00:47.637157+00	Sthefani	Ahu	Refri, Chá ou Suco
619	2026-02-12 18:03:19.035737+00	Lidiane	Alto da XV	Refri, Chá ou Suco
620	2026-02-12 18:03:32.750378+00	Lidiane	Alto da XV	Refri, Chá ou Suco
621	2026-02-12 18:23:19.308195+00	Tielly	Batel	Pequeno ( 1 bola )
622	2026-02-12 19:45:16.231389+00	Lidiane	Alto da XV	Pote 480ml
623	2026-02-12 20:33:30.318674+00	Sthefani	Ahu	COMBO SEGUNDA - Nutella e Morango
624	2026-02-12 20:47:09.563401+00	Sthefani	Ahu	Latte
625	2026-02-13 15:54:52.425263+00	Talita	Alto da XV	Refri, Chá ou Suco
626	2026-02-13 16:28:12.904212+00	Sthefani	Ahu	Capuccino Brasileiro
627	2026-02-13 16:53:01.297506+00	Talita	Alto da XV	Pequeno ( 1 Sabor )
628	2026-02-13 18:34:24.140252+00	Lidiane	Alto da XV	Sanduíche de Pernil
629	2026-02-13 18:34:41.426626+00	Lidiane	Alto da XV	Refri, Chá ou Suco
630	2026-02-13 19:07:31.062218+00	Tielly	Batel	Pequeno ( 1 bola )
631	2026-02-13 20:25:04.332506+00	Arielle	Ahu	Refri, Chá ou Suco
632	2026-02-14 17:00:37.799583+00	Lidiane	Alto da XV	Médio ( até 2 Sabores )
633	2026-02-14 17:07:54.840921+00	Tielly	Batel	Salgados Pequeno 8un
634	2026-02-14 17:43:40.414646+00	Henrique	Ahu	Água
635	2026-02-14 18:16:50.845708+00	Lidiane	Alto da XV	Refri, Chá ou Suco
636	2026-02-14 19:42:27.117722+00	Henrique	Alto da XV	Pequeno ( 1 Sabor )
637	2026-02-14 20:21:07.99384+00	Cassia	Alto da XV	Refri, Chá ou Suco
638	2026-02-15 14:43:33.0846+00	Arielle	Ahu	Cascão Unitário
639	2026-02-15 14:43:47.329171+00	Arielle	Ahu	Gelato Carmella - 60gr
640	2026-02-15 16:27:18.75633+00	Arielle	Ahu	Refri, Chá ou Suco
641	2026-02-15 19:53:31.205177+00	Cassia	Alto da XV	Médio ( até 2 Sabores )
642	2026-02-15 20:43:06.647357+00	Lidiane	Alto da XV	Médio ( até 2 Sabores )
643	2026-02-16 15:20:27.711358+00	Cassia	Alto da XV	Café Passado
644	2026-02-16 16:17:37.467643+00	Arielle	Ahu	Gelato Carmella - 60gr
645	2026-02-16 17:19:21.92083+00	Lidiane	Alto da XV	Refri, Chá ou Suco
646	2026-02-16 18:00:07.01287+00	Arielle	Ahu	Pote 480ml
647	2026-02-16 19:35:04.956242+00	Henrique	Alto da XV	Mocha
648	2026-02-16 20:00:58.867576+00	Tielly	Batel	Salgados Pequeno 8un
649	2026-02-16 21:05:48.884298+00	Cassia	Alto da XV	Sanduíche de Frango
650	2026-02-16 21:12:09.935436+00	Arielle	Ahu	Pequeno ( 1 Sabor )
651	2026-02-17 16:28:21.648437+00	Arielle	Ahu	Refri, Chá ou Suco
652	2026-02-17 22:23:21.44311+00	Arielle	Ahu	Gelato Carmella - 60gr
653	2026-02-18 16:10:58.001352+00	Talita	Alto da XV	Refri, Chá ou Suco
654	2026-02-18 16:11:22.149747+00	Talita	Alto da XV	Sanduíche de Pernil
655	2026-02-18 17:19:18.362003+00	Lidiane	Alto da XV	Refri, Chá ou Suco
656	2026-02-18 18:17:22.681837+00	Cassia	Alto da XV	Refri, Chá ou Suco
657	2026-02-18 18:35:07.894012+00	Arielle	Ahu	Refri, Chá ou Suco
658	2026-02-18 19:12:59.882031+00	Tielly	Batel	Refri, Chá ou Suco
659	2026-02-18 22:53:57.945151+00	Arielle	Ahu	Médio ( até 2 Sabores )
660	2026-02-19 17:38:36.558786+00	Talita	Alto da XV	Refri, Chá ou Suco
661	2026-02-19 18:37:47.407984+00	Lidiane	Alto da XV	Refri, Chá ou Suco
662	2026-02-19 20:36:18.53456+00	Lidiane	Alto da XV	Pequeno ( 1 Sabor )
663	2026-02-19 20:38:49.534707+00	Cassia	Alto da XV	Pequeno ( 1 Sabor )
664	2026-02-19 22:07:50.481618+00	Sthefani	Ahu	Água
665	2026-02-20 15:12:50.020025+00	Sthefani	Ahu	Mocha
666	2026-02-20 15:37:41.812415+00	Sthefani	Ahu	Nutella - 40gr
667	2026-02-20 15:49:40.494194+00	Talita	Alto da XV	Refri, Chá ou Suco
668	2026-02-20 15:52:15.493661+00	Arielle	Ahu	Waffle de Liege
669	2026-02-20 16:34:06.388637+00	Talita	Alto da XV	Médio ( até 2 Sabores )
670	2026-02-20 18:34:20.282654+00	Arielle	Ahu	Refri, Chá ou Suco
671	2026-02-20 19:08:12.740615+00	Lidiane	Alto da XV	Refri, Chá ou Suco
672	2026-02-20 21:38:09.312193+00	Sthefani	Ahu	Sanduíche de Mortadela
673	2026-02-20 21:38:19.436836+00	Sthefani	Ahu	Refri, Chá ou Suco
674	2026-02-21 14:51:28.539895+00	Sthefani	Ahu	Latte
675	2026-02-21 16:13:30.047923+00	Lidiane	Alto da XV	Sanduíche de Mortadela
676	2026-02-21 16:13:52.614026+00	Lidiane	Alto da XV	Refri, Chá ou Suco
677	2026-02-21 17:17:03.06832+00	Cassia	Alto da XV	Refri, Chá ou Suco
678	2026-02-21 17:32:00.046734+00	Arielle	Ahu	Refri, Chá ou Suco
679	2026-02-21 20:17:39.526328+00	Cassia	Alto da XV	Brownie
680	2026-02-22 16:59:26.124558+00	Sthefani	Ahu	Refri, Chá ou Suco
681	2026-02-22 19:55:43.413798+00	Cassia	Alto da XV	Capuccino Brasileiro
682	2026-02-23 16:02:28.445625+00	Talita	Alto da XV	Refri, Chá ou Suco
683	2026-02-23 18:11:49.700786+00	Sthefani	Ahu	Refri, Chá ou Suco
684	2026-02-23 18:33:27.048911+00	Lidiane	Alto da XV	Refri, Chá ou Suco
685	2026-02-23 20:10:19.993339+00	Lidiane	Alto da XV	Brownie
686	2026-02-23 20:15:07.964383+00	Cassia	Alto da XV	COMBO SEGUNDA - Nutella e Morango
687	2026-02-24 16:09:52.832157+00	Talita	Alto da XV	Refri, Chá ou Suco
688	2026-02-24 19:24:26.141144+00	Cassia	Alto da XV	Capuccino Brasileiro
689	2026-02-25 15:39:44.013646+00	Henrique	Ahu	Médio ( até 2 Sabores )
690	2026-02-25 16:04:18.667445+00	Talita	Alto da XV	Refri, Chá ou Suco
691	2026-02-25 16:04:46.581966+00	Talita	Alto da XV	Sanduíche de Parma
692	2026-02-25 19:59:45.056312+00	Henrique	Ahu	Refri, Chá ou Suco
693	2026-02-25 19:59:56.938583+00	Henrique	Ahu	Refri, Chá ou Suco
694	2026-02-25 20:55:50.745503+00	Cassia	Alto da XV	Médio ( até 2 Sabores )
695	2026-02-26 16:02:02.492707+00	Talita	Alto da XV	Refri, Chá ou Suco
696	2026-02-26 16:02:25.413258+00	Talita	Alto da XV	Sanduíche de Parma
697	2026-02-26 16:18:34.056645+00	Sthefani	Ahu	Latte
698	2026-02-26 19:51:37.191845+00	Cassia	Alto da XV	Refri, Chá ou Suco
699	2026-02-26 20:37:20.774916+00	Cassia	Alto da XV	Brownie
700	2026-02-27 14:46:50.909753+00	Sthefani	Ahu	Latte
701	2026-02-27 14:47:09.897004+00	Arielle	Ahu	Gelato Carmella - 60gr
702	2026-02-27 15:56:19.50077+00	Talita	Alto da XV	Refri, Chá ou Suco
703	2026-02-27 17:30:33.585219+00	Lidiane	Alto da XV	COMBO TERÇA - Doce de Leite e Paçoca
704	2026-02-27 17:31:03.411605+00	Lidiane	Alto da XV	Refri, Chá ou Suco
705	2026-02-27 18:56:10.390284+00	Arielle	Ahu	Refri, Chá ou Suco
706	2026-02-27 19:49:43.695369+00	Sthefani	Ahu	Latte
707	2026-02-28 17:32:07.292815+00	Cassia	Alto da XV	Refri, Chá ou Suco
708	2026-02-28 17:34:40.503903+00	Sthefani	Ahu	Refri, Chá ou Suco
709	2026-02-28 18:44:00.089396+00	Arielle	Ahu	Refri, Chá ou Suco
710	2026-02-28 21:17:31.300146+00	Arielle	Ahu	Brownie
711	2026-02-28 21:18:39.013157+00	Sthefani	Ahu	Latte
712	2026-02-28 21:22:44.382074+00	Lidiane	Alto da XV	Pequeno ( 1 Sabor )
713	2026-02-28 21:27:30.061142+00	Cassia	Alto da XV	Médio ( até 2 Sabores )
714	2026-03-01 17:23:46.042731+00	Sthefani	Ahu	Refri, Chá ou Suco
715	2026-03-01 18:26:49.075417+00	Sthefani	Ahu	Latte
716	2026-03-01 19:12:52.917564+00	Lidiane	Alto da XV	Refri, Chá ou Suco
717	2026-03-01 19:40:27.059024+00	Henrique	Ahu	Refri, Chá ou Suco
718	2026-03-01 19:56:50.712998+00	Lidiane	Alto da XV	Brownie
719	2026-03-01 22:30:53.573991+00	Sthefani	Ahu	Refri, Chá ou Suco
720	2026-03-01 22:31:07.322341+00	Sthefani	Ahu	Refri, Chá ou Suco
721	2026-03-02 16:02:19.120323+00	Talita	Alto da XV	Refri, Chá ou Suco
722	2026-03-02 16:53:52.208508+00	Sthefani	Ahu	Latte
723	2026-03-02 16:59:01.478884+00	Sthefani	Ahu	Sanduíche de Frango
724	2026-03-02 18:33:54.525968+00	Cassia	Alto da XV	Refri, Chá ou Suco
725	2026-03-02 20:35:43.80272+00	Sthefani	Ahu	Mini Óreo - 30gr / 9 bolachas
726	2026-03-02 22:18:02.687823+00	Sthefani	Ahu	Capuccino Brasileiro
727	2026-03-02 22:18:13.500671+00	Sthefani	Ahu	Waffle de Liege
728	2026-03-03 14:45:52.911407+00	Marina	Alto da XV	Refri, Chá ou Suco
729	2026-03-03 17:30:34.164962+00	Sthefani	Ahu	Refri, Chá ou Suco
730	2026-03-03 17:30:43.186761+00	Sthefani	Ahu	Refri, Chá ou Suco
731	2026-03-03 17:30:55.087639+00	Sthefani	Ahu	Refri, Chá ou Suco
732	2026-03-03 18:20:57.716066+00	Cassia	Alto da XV	Refri, Chá ou Suco
733	2026-03-03 18:38:18.459388+00	Arielle	Ahu	Refri, Chá ou Suco
734	2026-03-03 19:30:18.817135+00	Henrique	Alto da XV	Água
735	2026-03-03 19:30:29.692246+00	Henrique	Alto da XV	Água
736	2026-03-03 20:08:15.341195+00	Sthefani	Ahu	Latte
737	2026-03-03 20:19:50.578722+00	Sthefani	Ahu	Waffle de Liege
738	2026-03-03 20:20:35.35785+00	Sthefani	Ahu	Latte
739	2026-03-03 21:34:42.389635+00	Henrique	Ahu	Pequeno ( 1 Sabor )
740	2026-03-04 16:30:08.967558+00	Lidiane	Alto da XV	Sanduíche de Mortadela
741	2026-03-04 16:37:51.045217+00	Talita	Alto da XV	Refri, Chá ou Suco
742	2026-03-04 17:23:57.704187+00	Talita	Alto da XV	Médio ( até 2 Sabores )
743	2026-03-04 17:32:58.844749+00	Cassia	Ahu	Refri, Chá ou Suco
744	2026-03-04 17:34:08.452057+00	Endryw	Ahu	Médio ( até 2 Sabores )
745	2026-03-04 17:34:38.164491+00	Endryw	Ahu	Refri, Chá ou Suco
746	2026-03-04 17:34:49.100822+00	Endryw	Ahu	Refri, Chá ou Suco
747	2026-03-04 18:56:13.926905+00	Cassia	Ahu	Médio ( até 2 Sabores )
748	2026-03-04 19:57:25.998554+00	Endryw	Ahu	Sanduíche de Mortadela
749	2026-03-04 20:36:01.73289+00	Cassia	Ahu	Capuccino Brasileiro
750	2026-03-05 17:32:06.480243+00	Lidiane	Alto da XV	Refri, Chá ou Suco
751	2026-03-05 18:34:38.362336+00	Cassia	Alto da XV	Refri, Chá ou Suco
752	2026-03-05 18:59:36.879515+00	Endryw	Ahu	Refri, Chá ou Suco
753	2026-03-05 18:59:59.00151+00	Endryw	Ahu	Refri, Chá ou Suco
754	2026-03-05 19:19:07.950385+00	Endryw	Ahu	Refri, Chá ou Suco
755	2026-03-05 20:13:29.801747+00	Cassia	Alto da XV	Waffle de Liege
756	2026-03-05 20:14:21.980192+00	Cassia	Alto da XV	Nutella - 40gr
757	2026-03-05 21:20:43.238001+00	Lidiane	Alto da XV	Brownie
758	2026-03-05 21:47:41.338887+00	Endryw	Ahu	Médio ( até 2 Sabores )
759	2026-03-05 22:08:02.832846+00	Endryw	Ahu	COMBO SEGUNDA - Nutella e Morango
760	2026-03-06 12:07:59.853344+00	Talita	Alto da XV	Refri, Chá ou Suco
761	2026-03-06 15:25:42.181947+00	Sthefani	Ahu	Refri, Chá ou Suco
762	2026-03-06 16:19:12.855545+00	Talita	Alto da XV	Refri, Chá ou Suco
763	2026-03-06 17:05:28.150362+00	Talita	Alto da XV	Médio ( até 2 Sabores )
764	2026-03-06 18:41:18.380111+00	Lidiane	Alto da XV	Refri, Chá ou Suco
765	2026-03-06 22:45:35.599445+00	Sthefani	Ahu	Brownie
766	2026-03-07 17:02:33.257275+00	Cassia	Alto da XV	Refri, Chá ou Suco
767	2026-03-07 18:12:05.925119+00	Cassia	Alto da XV	Médio ( até 2 Sabores )
768	2026-03-07 18:32:40.762121+00	Arielle	Ahu	Refri, Chá ou Suco
769	2026-03-07 21:07:08.288006+00	Henrique	Ahu	Médio ( até 2 Sabores )
770	2026-03-07 22:28:04.154261+00	Arielle	Ahu	Gelato Carmella - 60gr
771	2026-03-07 22:28:17.285689+00	Arielle	Ahu	Gelato Carmella - 60gr
772	2026-03-08 16:31:28.857189+00	Sthefani	Ahu	Mocha
773	2026-03-08 18:32:05.302493+00	Arielle	Ahu	Refri, Chá ou Suco
774	2026-03-08 18:32:31.750808+00	Arielle	Ahu	Gelato Carmella - 60gr
775	2026-03-08 19:30:23.073029+00	Sthefani	Ahu	Waffle de Liege
776	2026-03-08 19:31:06.177789+00	Sthefani	Ahu	Nutella - 40gr
777	2026-03-08 19:48:18.933575+00	Lidiane	Alto da XV	Waffle de Liege
778	2026-03-08 19:48:50.755601+00	Lidiane	Alto da XV	Nutella - 40gr
779	2026-03-08 19:49:25.76273+00	Lidiane	Alto da XV	Gelato Carmella - 60gr
780	2026-03-09 16:20:56.640537+00	Arielle	Ahu	Gelato Carmella - 60gr
781	2026-03-09 16:25:18.444551+00	Talita	Alto da XV	Refri, Chá ou Suco
782	2026-03-09 16:50:07.615864+00	Marina	Alto da XV	Refri, Chá ou Suco
783	2026-03-09 17:35:05.6973+00	Sthefani	Ahu	Pote 480ml
784	2026-03-09 18:36:46.204541+00	Lidiane	Alto da XV	Refri, Chá ou Suco
785	2026-03-09 20:15:44.144214+00	Arielle	Ahu	Sanduíche de Carne
786	2026-03-09 20:16:06.692135+00	Arielle	Ahu	Gelato Carmella - 60gr
787	2026-03-09 20:16:17.300432+00	Arielle	Ahu	Cascão Unitário
788	2026-03-09 20:19:17.485752+00	Sthefani	Ahu	Latte
789	2026-03-09 20:50:42.706541+00	Cassia	Alto da XV	COMBO SEGUNDA - Nutella e Morango
790	2026-03-09 20:51:35.604732+00	Cassia	Alto da XV	Capuccino Brasileiro
791	2026-03-09 20:55:04.96195+00	Lidiane	Alto da XV	COMBO SEGUNDA - Nutella e Morango
792	2026-03-09 20:55:27.660795+00	Lidiane	Alto da XV	Capuccino Brasileiro
793	2026-03-09 20:55:43.552189+00	Henrique	Ahu	Pequeno ( 1 Sabor )
794	2026-03-10 14:24:17.595315+00	Sthefani	Ahu	Latte
795	2026-03-10 16:08:13.748231+00	Talita	Alto da XV	Refri, Chá ou Suco
796	2026-03-10 16:08:42.67584+00	Talita	Alto da XV	Sanduíche de Parma
797	2026-03-10 17:27:02.10384+00	Cassia	Alto da XV	Refri, Chá ou Suco
798	2026-03-10 17:49:42.289703+00	Talita	Alto da XV	Waffle de Liege
799	2026-03-10 17:50:05.160226+00	Talita	Alto da XV	Nutella - 40gr
800	2026-03-10 21:25:04.655847+00	Sthefani	Ahu	Latte
801	2026-03-10 21:28:12.544688+00	Cassia	Alto da XV	Pequeno ( 1 Sabor )
802	2026-03-11 15:54:59.434374+00	Arielle	Ahu	Refri, Chá ou Suco
803	2026-03-11 16:30:48.019926+00	Talita	Alto da XV	Refri, Chá ou Suco
804	2026-03-11 16:31:10.596049+00	Talita	Alto da XV	Sanduíche de Pernil
805	2026-03-11 17:34:34.349935+00	Lidiane	Alto da XV	Refri, Chá ou Suco
806	2026-03-11 20:00:19.473335+00	Lidiane	Alto da XV	Médio ( até 2 Sabores )
807	2026-03-11 20:35:54.148065+00	Arielle	Ahu	Pequeno ( 1 Sabor )
808	2026-03-12 16:19:05.969949+00	Talita	Alto da XV	Refri, Chá ou Suco
809	2026-03-12 16:20:27.409846+00	Sthefani	Ahu	Chocolate Quente
810	2026-03-12 17:45:05.117825+00	Lidiane	Alto da XV	Refri, Chá ou Suco
811	2026-03-12 18:34:23.785201+00	Endryw	Ahu	Brownie + Gelato
812	2026-03-12 18:41:32.835617+00	Cassia	Alto da XV	Refri, Chá ou Suco
813	2026-03-12 21:43:48.896512+00	Sthefani	Ahu	Refri, Chá ou Suco
814	2026-03-12 21:44:07.923787+00	Sthefani	Ahu	Refri, Chá ou Suco
815	2026-03-13 16:09:43.928353+00	Talita	Alto da XV	Refri, Chá ou Suco
816	2026-03-13 17:05:25.431533+00	Arielle	Ahu	Cascão Unitário
817	2026-03-13 17:34:49.480604+00	Sthefani	Ahu	Refri, Chá ou Suco
818	2026-03-13 18:05:02.588394+00	Arielle	Ahu	Água
819	2026-03-13 21:25:14.256337+00	Lidiane	Alto da XV	Médio ( até 2 Sabores )
820	2026-03-13 22:00:48.657009+00	Sthefani	Ahu	Refri, Chá ou Suco
821	2026-03-14 16:37:12.189655+00	Sthefani	Ahu	Mocha
822	2026-03-14 17:44:10.186781+00	Lidiane	Alto da XV	Refri, Chá ou Suco
823	2026-03-14 17:49:48.164609+00	Arielle	Ahu	Brownie
824	2026-03-14 18:43:16.350885+00	Cassia	Alto da XV	Refri, Chá ou Suco
825	2026-03-14 20:44:56.716967+00	Sthefani	Ahu	Waffle de Liege
826	2026-03-14 20:47:53.457578+00	Sthefani	Ahu	Latte
827	2026-03-14 21:04:40.831925+00	Arielle	Ahu	Waffle de Liege
828	2026-03-14 21:53:54.68992+00	Arielle	Ahu	Nutella - 40gr
829	2026-03-14 21:54:18.952439+00	Arielle	Ahu	Gelato Carmella - 60gr
830	2026-03-14 21:59:07.530608+00	Endryw	Ahu	Brownie
831	2026-03-14 22:07:08.517244+00	Lidiane	Alto da XV	Refri, Chá ou Suco
832	2026-03-14 22:07:32.571304+00	Cassia	Alto da XV	Refri, Chá ou Suco
833	2026-03-15 16:00:58.019554+00	Endryw	Ahu	Refri, Chá ou Suco
834	2026-03-15 19:20:53.238594+00	Henrique	Ahu	Refri, Chá ou Suco
835	2026-03-15 20:18:22.194857+00	Endryw	Ahu	Refri, Chá ou Suco
836	2026-03-15 21:40:54.457815+00	Cassia	Alto da XV	Médio ( até 2 Sabores )
837	2026-03-15 21:42:40.318378+00	Lidiane	Alto da XV	Médio ( até 2 Sabores )
838	2026-03-15 22:28:14.35277+00	Arielle	Ahu	Waffle de Liege
839	2026-03-15 22:28:39.334192+00	Arielle	Ahu	Nutella - 40gr
840	2026-03-16 16:04:07.745818+00	Talita	Alto da XV	Refri, Chá ou Suco
841	2026-03-16 17:31:50.046119+00	Lidiane	Alto da XV	Refri, Chá ou Suco
842	2026-03-16 18:31:08.685383+00	Cassia	Alto da XV	Refri, Chá ou Suco
843	2026-03-16 19:22:53.031787+00	Sthefani	Ahu	Latte
844	2026-03-17 15:58:47.330106+00	Talita	Alto da XV	Refri, Chá ou Suco
845	2026-03-17 15:59:10.985436+00	Talita	Alto da XV	Sanduíche de Parma
846	2026-03-17 16:31:06.839309+00	Arielle	Ahu	Mocha
847	2026-03-17 17:19:41.668799+00	Henrique	Alto da XV	Refri, Chá ou Suco
848	2026-03-17 17:19:54.504691+00	Henrique	Alto da XV	Refri, Chá ou Suco
849	2026-03-18 17:39:33.246935+00	Lidiane	Alto da XV	Água
850	2026-03-18 17:40:19.697387+00	Lidiane	Alto da XV	Sanduíche de Frango
851	2026-03-18 18:04:33.390286+00	Arielle	Ahu	Pote 480ml
852	2026-03-18 18:33:36.612118+00	Cassia	Alto da XV	Refri, Chá ou Suco
853	2026-03-18 19:14:36.308159+00	Endryw	Ahu	Médio ( até 2 Sabores )
854	2026-03-19 16:00:12.104176+00	Talita	Alto da XV	Refri, Chá ou Suco
855	2026-03-19 17:28:59.808514+00	Cassia	Alto da XV	Refri, Chá ou Suco
856	2026-03-19 18:36:35.693435+00	Lidiane	Alto da XV	Refri, Chá ou Suco
857	2026-03-19 18:43:30.343361+00	Endryw	Ahu	Refri, Chá ou Suco
858	2026-03-19 19:20:23.396274+00	Endryw	Ahu	Médio ( até 2 Sabores )
859	2026-03-19 19:49:57.009213+00	Sthefani	Ahu	Refri, Chá ou Suco
860	2026-03-19 19:50:11.635266+00	Sthefani	Ahu	Latte
861	2026-03-19 20:36:22.47964+00	Endryw	Ahu	Refri, Chá ou Suco
862	2026-03-20 17:22:31.115233+00	Talita	Alto da XV	Refri, Chá ou Suco
863	2026-03-20 18:03:54.152424+00	Talita	Alto da XV	Médio ( até 2 Sabores )
864	2026-03-20 22:04:01.957534+00	Sthefani	Ahu	Gelato Carmella - 60gr
865	2026-03-20 22:04:20.110687+00	Sthefani	Ahu	Gelato Carmella - 60gr
866	2026-03-21 15:56:01.25311+00	Endryw	Alto da XV	Refri, Chá ou Suco
867	2026-03-21 16:29:54.429683+00	Endryw	Alto da XV	Brownie + Gelato
868	2026-03-21 17:35:54.792708+00	Cassia	Alto da XV	Refri, Chá ou Suco
869	2026-03-21 18:31:11.943884+00	Endryw	Alto da XV	Refri, Chá ou Suco
870	2026-03-21 18:58:05.357826+00	Cassia	Alto da XV	Médio ( até 2 Sabores )
871	2026-03-21 19:36:56.493573+00	Endryw	Alto da XV	Médio ( até 2 Sabores )
872	2026-03-21 20:06:44.609481+00	Cassia	Alto da XV	Waffle de Liege
873	2026-03-21 20:07:24.299158+00	Cassia	Alto da XV	Nutella - 40gr
874	2026-03-21 20:30:03.70134+00	Lidiane	Alto da XV	Brownie
875	2026-03-21 21:59:24.479207+00	Marina	Ahu	Pote 480ml
876	2026-03-21 22:08:51.056575+00	Endryw	Alto da XV	Refri, Chá ou Suco
877	2026-03-22 16:47:45.93884+00	Lidiane	Alto da XV	Refri, Chá ou Suco
878	2026-03-22 20:10:29.982089+00	Arielle	Ahu	Nutella - 40gr
879	2026-03-22 20:30:47.172586+00	Sthefani	Ahu	Brownie
880	2026-03-22 21:57:37.009733+00	Cassia	Alto da XV	Refri, Chá ou Suco
881	2026-03-22 21:58:10.157444+00	Cassia	Alto da XV	Médio ( até 2 Sabores )
882	2026-03-23 12:05:47.799362+00	Talita	Alto da XV	Refri, Chá ou Suco
883	2026-03-23 15:10:54.009638+00	Sthefani	Ahu	Banana - 35gr
884	2026-03-23 15:45:37.475619+00	Lidiane	Alto da XV	Pequeno ( 1 Sabor )
885	2026-03-23 16:55:19.561151+00	Sthefani	Ahu	Refri, Chá ou Suco
886	2026-03-23 17:10:09.421195+00	Talita	Alto da XV	Refri, Chá ou Suco
887	2026-03-23 17:26:55.550359+00	Cassia	Alto da XV	Refri, Chá ou Suco
888	2026-03-23 18:32:20.445203+00	Lidiane	Alto da XV	Refri, Chá ou Suco
889	2026-03-23 18:36:44.854708+00	Henrique	Alto da XV	Refri, Chá ou Suco
890	2026-03-23 19:50:57.243007+00	Lidiane	Alto da XV	Brownie
891	2026-03-24 15:07:35.295158+00	Endryw	Alto da XV	Refri, Chá ou Suco
892	2026-03-24 16:03:30.582975+00	Talita	Alto da XV	Água
893	2026-03-24 17:30:50.520004+00	Cassia	Alto da XV	Sanduíche de Parma
894	2026-03-24 17:31:05.915652+00	Cassia	Alto da XV	Refri, Chá ou Suco
895	2026-03-24 17:38:48.52507+00	Talita	Alto da XV	Médio ( até 2 Sabores )
896	2026-03-25 17:19:01.126642+00	Talita	Alto da XV	Refri, Chá ou Suco
897	2026-03-25 17:19:17.880864+00	Talita	Alto da XV	Sanduíche de Parma
898	2026-03-25 17:27:21.960067+00	Cassia	Alto da XV	Refri, Chá ou Suco
899	2026-03-25 19:37:41.799435+00	Cassia	Alto da XV	Médio ( até 2 Sabores )
900	2026-03-26 16:20:00.279979+00	Talita	Alto da XV	Refri, Chá ou Suco
901	2026-03-26 16:57:58.226218+00	Sthefani	Ahu	Caramel - Latte
902	2026-03-26 17:26:49.267102+00	Lidiane	Alto da XV	Médio ( até 2 Sabores )
903	2026-03-26 20:09:39.173102+00	Cassia	Alto da XV	Médio ( até 2 Sabores )
904	2026-03-26 20:10:15.550931+00	Lidiane	Alto da XV	Médio ( até 2 Sabores )
905	2026-03-26 22:00:03.972347+00	Sthefani	Ahu	Brownie
906	2026-03-27 15:54:27.818586+00	Talita	Alto da XV	Refri, Chá ou Suco
907	2026-03-27 17:27:04.461677+00	Endryw	Alto da XV	Refri, Chá ou Suco
908	2026-03-27 17:39:03.799786+00	Talita	Alto da XV	Médio ( até 2 Sabores )
909	2026-03-27 17:51:01.030016+00	Sthefani	Ahu	Latte
910	2026-03-27 19:47:50.502284+00	Endryw	Alto da XV	Refri, Chá ou Suco
911	2026-03-27 22:26:51.273267+00	Endryw	Alto da XV	Refri, Chá ou Suco
912	2026-03-28 17:10:48.807547+00	Endryw	Ahu	Refri, Chá ou Suco
913	2026-03-28 17:29:41.744737+00	Cassia	Alto da XV	Refri, Chá ou Suco
914	2026-03-28 18:47:40.326524+00	Endryw	Ahu	Refri, Chá ou Suco
915	2026-03-28 18:53:05.403438+00	Endryw	Ahu	Refri, Chá ou Suco
916	2026-03-28 20:50:51.07375+00	Endryw	Ahu	Médio ( até 2 Sabores )
919	2026-03-29 17:14:41.19976+00	Endryw	Ahu	Refri, Chá ou Suco
920	2026-03-29 17:35:01.797989+00	Cassia	Alto da XV	Refri, Chá ou Suco
921	2026-03-29 19:41:39.518085+00	Endryw	Ahu	Médio ( até 2 Sabores )
922	2026-03-29 22:20:55.097706+00	Endryw	Ahu	Refri, Chá ou Suco
923	2026-03-30 16:10:04.398528+00	Talita	Alto da XV	Refri, Chá ou Suco
924	2026-03-30 18:31:26.695623+00	Cassia	Alto da XV	Refri, Chá ou Suco
925	2026-03-30 20:30:19.165146+00	Sthefani	Ahu	Latte
926	2026-03-31 15:23:32.906626+00	Endryw	Alto da XV	Refri, Chá ou Suco
927	2026-03-31 15:52:38.740728+00	Endryw	Alto da XV	Mocha
928	2026-03-31 15:53:28.283064+00	Cassia	Alto da XV	Capuccino Brasileiro
929	2026-03-31 15:57:20.672488+00	Talita	Alto da XV	Sanduíche de Carne
930	2026-03-31 15:57:55.725539+00	Talita	Alto da XV	Água
931	2026-03-31 17:31:03.970628+00	Cassia	Alto da XV	Refri, Chá ou Suco
932	2026-03-31 18:35:30.497034+00	Sthefani	Ahu	Refri, Chá ou Suco
933	2026-03-31 20:31:15.376278+00	Endryw	Alto da XV	COMBO SEGUNDA - Nutella e Morango
934	2026-03-31 20:32:19.428845+00	Endryw	Alto da XV	Refri, Chá ou Suco
935	2026-03-31 21:54:44.876897+00	Sthefani	Ahu	Capuccino Brasileiro
936	2026-04-01 17:37:30.874186+00	Cassia	Alto da XV	Refri, Chá ou Suco
937	2026-04-01 19:00:45.491149+00	Amanda	Alto da XV	Waffle de Liege
938	2026-04-01 19:01:18.440718+00	Amanda	Alto da XV	Nutella - 40gr
939	2026-04-01 19:50:41.271089+00	Endryw	Ahu	Waffle de Liege
940	2026-04-01 19:50:53.728534+00	Endryw	Ahu	Nutella - 40gr
941	2026-04-01 19:51:10.066834+00	Endryw	Ahu	Gelato Carmella - 60gr
942	2026-04-01 22:09:00.838384+00	Endryw	Ahu	Refri, Chá ou Suco
943	2026-04-02 12:00:44.144657+00	Talita	Alto da XV	Refri, Chá ou Suco
944	2026-04-02 15:18:43.009563+00	Sthefani	Ahu	Refri, Chá ou Suco
945	2026-04-02 15:59:50.16255+00	Talita	Alto da XV	Refri, Chá ou Suco
946	2026-04-02 17:19:04.01634+00	Endryw	Ahu	Refri, Chá ou Suco
947	2026-04-02 17:27:06.730686+00	Cassia	Alto da XV	Refri, Chá ou Suco
948	2026-04-02 18:32:03.673713+00	Sthefani	Ahu	Refri, Chá ou Suco
949	2026-04-02 19:38:12.065306+00	Amanda	Alto da XV	Médio ( até 2 Sabores )
950	2026-04-02 20:11:13.638862+00	Cassia	Alto da XV	Médio ( até 2 Sabores )
951	2026-04-03 15:22:10.460265+00	Amanda	Alto da XV	Sanduíche de Carne
952	2026-04-03 15:24:42.92369+00	Amanda	Alto da XV	Refri, Chá ou Suco
953	2026-04-03 15:30:21.858939+00	Endryw	Ahu	Nutella - 40gr
954	2026-04-03 16:35:15.366666+00	Amanda	Alto da XV	Grande ( até 3 Sabores )
955	2026-04-03 16:39:10.525164+00	Amanda	Alto da XV	Waffle de Liege
956	2026-04-03 16:39:31.135714+00	Amanda	Alto da XV	Nutella - 40gr
957	2026-04-03 16:39:51.050739+00	Amanda	Alto da XV	Morango - 35gr
958	2026-04-03 21:57:03.902366+00	Sthefani	Ahu	Capuccino Brasileiro
959	2026-04-03 22:14:25.82542+00	Henrique	Alto da XV	Refri, Chá ou Suco
960	2026-04-03 22:14:41.369293+00	Henrique	Alto da XV	Refri, Chá ou Suco
961	2026-04-04 14:29:43.643868+00	Cassia	Alto da XV	Água
962	2026-04-04 17:34:56.561179+00	Cassia	Alto da XV	Refri, Chá ou Suco
963	2026-04-04 19:18:24.047114+00	Endryw	Ahu	Médio ( até 2 Sabores )
964	2026-04-04 20:33:32.293244+00	Sthefani	Ahu	Latte
965	2026-04-05 15:02:09.205839+00	Sthefani	Ahu	Latte
966	2026-04-05 16:00:23.013001+00	Amanda	Alto da XV	Sanduíche de Mortadela
967	2026-04-05 17:41:10.128714+00	Cassia	Alto da XV	Refri, Chá ou Suco
968	2026-04-06 16:18:28.451956+00	Talita	Alto da XV	Refri, Chá ou Suco
969	2026-04-06 16:18:53.943916+00	Talita	Alto da XV	Sanduíche de Parma
970	2026-04-06 16:27:20.314201+00	Cassia	Alto da XV	Refri, Chá ou Suco
971	2026-04-06 19:22:49.835322+00	Marina	Ahu	Pequeno ( 1 Sabor )
972	2026-04-06 21:43:26.913616+00	Amanda	Alto da XV	Sanduíche de Mortadela
973	2026-04-06 22:06:47.144432+00	Sthefani	Ahu	Refri, Chá ou Suco
974	2026-04-06 22:06:56.471674+00	Sthefani	Ahu	Refri, Chá ou Suco
975	2026-04-07 16:59:11.088891+00	Talita	Alto da XV	Refri, Chá ou Suco
976	2026-04-07 17:30:25.250087+00	Sthefani	Ahu	Refri, Chá ou Suco
977	2026-04-07 18:04:12.219893+00	Cassia	Alto da XV	Refri, Chá ou Suco
978	2026-04-08 13:04:33.844861+00	Talita	Alto da XV	Refri, Chá ou Suco
979	2026-04-08 16:01:46.928858+00	Talita	Alto da XV	Refri, Chá ou Suco
980	2026-04-08 16:58:38.820902+00	Amanda	Alto da XV	Médio ( até 2 Sabores )
981	2026-04-08 18:31:43.291164+00	Cassia	Alto da XV	Sanduíche de Parma
982	2026-04-08 18:31:55.581189+00	Cassia	Alto da XV	Refri, Chá ou Suco
983	2026-04-08 19:45:55.161376+00	Henrique	Alto da XV	Affogato
984	2026-04-08 20:35:12.628224+00	Henrique	Alto da XV	Chocolate Quente
985	2026-04-09 15:34:56.100708+00	Marina	Alto da XV	Refri, Chá ou Suco
986	2026-04-09 15:56:59.388259+00	Talita	Alto da XV	Refri, Chá ou Suco
987	2026-04-09 18:16:03.752819+00	Sthefani	Ahu	Refri, Chá ou Suco
988	2026-04-09 21:43:06.703048+00	Sthefani	Ahu	Nutella - 40gr
989	2026-04-09 21:43:19.719548+00	Sthefani	Ahu	Nutella - 40gr
990	2026-04-09 21:43:31.363138+00	Sthefani	Ahu	Nutella - 40gr
991	2026-04-09 21:43:42.242124+00	Sthefani	Ahu	Nutella - 40gr
992	2026-04-10 16:07:10.421599+00	Talita	Alto da XV	Refri, Chá ou Suco
993	2026-04-10 16:07:29.877398+00	Talita	Alto da XV	Sanduíche de Carne
994	2026-04-11 16:14:06.9402+00	Marina	Alto da XV	Pequeno ( 1 Sabor )
995	2026-04-11 16:15:23.67829+00	Marina	Alto da XV	Pequeno ( 1 Sabor )
996	2026-04-12 15:50:58.480427+00	Sthefani	Ahu	Gelato Carmella - 60gr
997	2026-04-12 15:51:18.824968+00	Sthefani	Ahu	Gelato Carmella - 60gr
998	2026-04-12 16:46:54.364266+00	Amanda	Alto da XV	Médio ( até 2 Sabores )
999	2026-04-12 19:42:42.909354+00	Marina	Ahu	Refri, Chá ou Suco
1000	2026-04-12 20:35:11.058745+00	Sthefani	Ahu	Mocha
1001	2026-04-13 12:10:37.294624+00	Talita	Alto da XV	Refri, Chá ou Suco
1002	2026-04-13 16:08:41.885546+00	Talita	Alto da XV	Refri, Chá ou Suco
1003	2026-04-13 16:17:37.556171+00	Sthefani	Ahu	Nutella - 40gr
1004	2026-04-13 17:31:03.780265+00	Cassia	Alto da XV	Refri, Chá ou Suco
1005	2026-04-13 18:28:03.886652+00	Amanda	Alto da XV	Sanduíche de Mortadela
1006	2026-04-13 18:29:03.083763+00	Amanda	Alto da XV	Refri, Chá ou Suco
1007	2026-04-13 18:31:30.595003+00	Sthefani	Ahu	Cascão Unitário
1008	2026-04-13 18:31:44.820108+00	Sthefani	Ahu	Cascão Unitário
1009	2026-04-13 18:31:57.482873+00	Sthefani	Ahu	Cascão Unitário
1010	2026-04-13 21:42:13.349176+00	Amanda	Alto da XV	Sanduíche de Mortadela
1011	2026-04-13 21:56:16.838146+00	Sthefani	Ahu	Brownie
1012	2026-04-14 16:29:23.513719+00	Talita	Alto da XV	Refri, Chá ou Suco
1013	2026-04-14 17:57:46.92284+00	Cassia	Alto da XV	Refri, Chá ou Suco
1014	2026-04-14 18:16:11.912944+00	Sthefani	Ahu	Refri, Chá ou Suco
1015	2026-04-14 20:54:09.04509+00	Sthefani	Ahu	Nutella - 40gr
1016	2026-04-14 21:24:03.098738+00	Cassia	Alto da XV	Médio ( até 2 Sabores )
1017	2026-04-14 21:58:55.812754+00	Endryw	Ahu	Refri, Chá ou Suco
1018	2026-04-15 16:03:11.932481+00	Talita	Alto da XV	Refri, Chá ou Suco
1019	2026-04-15 16:31:29.530224+00	Endryw	Ahu	Médio ( até 2 Sabores )
1020	2026-04-15 18:31:09.414909+00	Cassia	Alto da XV	Refri, Chá ou Suco
1021	2026-04-15 19:27:31.422778+00	Endryw	Ahu	Waffle de Liege
1022	2026-04-15 19:27:51.825588+00	Endryw	Ahu	Nutella - 40gr
1023	2026-04-15 19:28:11.727203+00	Endryw	Ahu	Gelato Carmella - 60gr
1024	2026-04-15 23:22:14.326905+00	Endryw	Ahu	Refri, Chá ou Suco
1025	2026-04-16 14:50:21.028057+00	Sthefani	Ahu	Latte
1026	2026-04-16 15:02:03.149535+00	Endryw	Ahu	Refri, Chá ou Suco
1027	2026-04-16 15:51:52.260253+00	Talita	Alto da XV	Água
1028	2026-04-16 17:19:18.055167+00	Talita	Alto da XV	Chocolate Quente
1029	2026-04-16 17:34:03.28185+00	Sthefani	Ahu	Refri, Chá ou Suco
1030	2026-04-16 17:35:20.347257+00	Cassia	Alto da XV	Refri, Chá ou Suco
1031	2026-04-16 18:39:14.823682+00	Endryw	Ahu	Refri, Chá ou Suco
1032	2026-04-16 20:07:44.074291+00	Cassia	Alto da XV	Água
1033	2026-04-16 21:34:06.321902+00	Endryw	Ahu	Médio ( até 2 Sabores )
1034	2026-04-17 16:34:54.607614+00	Talita	Alto da XV	Sanduíche de Parma
1035	2026-04-17 16:35:09.980271+00	Talita	Alto da XV	Refri, Chá ou Suco
1036	2026-04-17 17:30:03.091407+00	Sthefani	Ahu	Refri, Chá ou Suco
1037	2026-04-17 18:46:13.180266+00	Amanda	Alto da XV	Pequeno ( 1 Sabor )
1038	2026-04-17 19:37:12.944396+00	Sthefani	Ahu	Latte
1039	2026-04-17 20:06:23.955639+00	Sthefani	Ahu	Nutella - 40gr
1040	2026-04-17 20:30:39.987705+00	Endryw	Ahu	Médio ( até 2 Sabores )
1041	2026-04-17 22:11:35.865213+00	Endryw	Ahu	Refri, Chá ou Suco
1042	2026-04-18 17:12:43.029343+00	Endryw	Ahu	Refri, Chá ou Suco
1043	2026-04-18 17:33:49.378567+00	Cassia	Alto da XV	Refri, Chá ou Suco
1044	2026-04-18 22:06:01.59149+00	Sthefani	Ahu	Latte
1045	2026-04-18 22:07:24.60243+00	Endryw	Ahu	Refri, Chá ou Suco
1046	2026-04-19 16:24:48.255716+00	Sthefani	Ahu	Refri, Chá ou Suco
1047	2026-04-19 17:30:23.593325+00	Sthefani	Ahu	Latte
1048	2026-04-19 17:34:50.429742+00	Cassia	Alto da XV	Refri, Chá ou Suco
1049	2026-04-19 19:39:15.185418+00	Marina	Ahu	Refri, Chá ou Suco
1050	2026-04-19 20:46:56.906661+00	Amanda	Alto da XV	Pequeno ( 1 Sabor )
1051	2026-04-19 21:55:41.535835+00	Sthefani	Ahu	Água
1052	2026-04-19 22:03:52.693567+00	Sthefani	Ahu	Refri, Chá ou Suco
1053	2026-04-20 18:30:20.065482+00	Sthefani	Ahu	COMBO SEGUNDA - Nutella e Morango
1054	2026-04-20 18:31:29.111474+00	Cassia	Alto da XV	Sanduíche de Carne
1055	2026-04-20 18:31:41.551609+00	Cassia	Alto da XV	Refri, Chá ou Suco
1056	2026-04-20 18:32:08.398164+00	Sthefani	Ahu	Latte
1057	2026-04-21 16:30:47.900146+00	Sthefani	Ahu	Refri, Chá ou Suco
1058	2026-04-21 16:40:59.361932+00	Talita	Alto da XV	Água
1059	2026-04-21 17:21:58.361365+00	Cassia	Alto da XV	Refri, Chá ou Suco
1060	2026-04-21 19:20:23.664304+00	Endryw	Ahu	Sanduíche de Mortadela
1061	2026-04-21 22:11:19.57385+00	Endryw	Ahu	Refri, Chá ou Suco
1062	2026-04-22 15:36:56.176773+00	Cassia	Alto da XV	Refri, Chá ou Suco
1063	2026-04-22 17:29:49.251143+00	Amanda	Alto da XV	Sanduíche de Mortadela
1064	2026-04-22 17:30:06.175147+00	Amanda	Alto da XV	Refri, Chá ou Suco
1065	2026-04-22 18:32:40.849782+00	Cassia	Alto da XV	Sanduíche de Parma
1066	2026-04-22 18:33:19.165381+00	Cassia	Alto da XV	Refri, Chá ou Suco
1067	2026-04-22 18:47:06.512034+00	Sthefani	Ahu	Refri, Chá ou Suco
1068	2026-04-22 18:59:46.554735+00	Endryw	Ahu	Médio ( até 2 Sabores )
1069	2026-04-23 15:51:24.601336+00	Amanda	Alto da XV	Médio ( até 2 Sabores )
1070	2026-04-23 16:28:23.594934+00	Talita	Alto da XV	Água
1071	2026-04-23 17:02:54.514088+00	Sthefani	Ahu	Pote 480ml
1072	2026-04-23 17:29:09.443746+00	Cassia	Alto da XV	Refri, Chá ou Suco
1073	2026-04-23 17:29:28.395364+00	Cassia	Alto da XV	Sanduíche de Carne
1074	2026-04-23 17:36:47.874245+00	Talita	Alto da XV	Médio ( até 2 Sabores )
1075	2026-04-23 18:04:45.166246+00	Endryw	Ahu	Pote 480ml
1076	2026-04-23 18:30:56.19587+00	Amanda	Alto da XV	Sanduíche de Mortadela
1077	2026-04-23 20:03:38.64291+00	Cassia	Alto da XV	Pequeno ( 1 Sabor )
1078	2026-04-23 20:44:17.478741+00	Endryw	Ahu	Médio ( até 2 Sabores )
1079	2026-04-24 15:55:47.316664+00	Talita	Alto da XV	Refri, Chá ou Suco
1080	2026-04-24 19:12:38.913815+00	Endryw	Ahu	Pote 480ml
1081	2026-04-24 22:24:41.531765+00	Amanda	Alto da XV	Pequeno ( 1 Sabor )
1082	2026-04-25 16:36:30.232167+00	Endryw	Ahu	Refri, Chá ou Suco
1083	2026-04-25 17:25:07.426984+00	Amanda	Alto da XV	Sanduíche de Parma
1084	2026-04-25 17:26:14.73063+00	Amanda	Alto da XV	Refri, Chá ou Suco
1085	2026-04-25 17:57:42.948237+00	Cassia	Alto da XV	Sanduíche de Carne
1086	2026-04-25 17:58:11.491277+00	Cassia	Alto da XV	Refri, Chá ou Suco
1087	2026-04-25 19:43:06.067747+00	Henrique	Alto da XV	Pequeno ( 1 Sabor )
1088	2026-04-25 19:43:15.962525+00	Henrique	Alto da XV	Pequeno ( 1 Sabor )
1089	2026-04-25 19:53:51.574258+00	Henrique	Alto da XV	Pequeno ( 1 Sabor )
1090	2026-04-26 17:32:38.422702+00	Cassia	Alto da XV	Sanduíche de Pernil
1091	2026-04-26 17:33:51.401087+00	Cassia	Alto da XV	Refri, Chá ou Suco
1092	2026-04-27 15:10:43.911511+00	Cassia	Alto da XV	COMBO SEGUNDA - Nutella e Morango
1093	2026-04-27 16:13:40.475588+00	Talita	Alto da XV	Refri, Chá ou Suco
1094	2026-04-27 16:14:37.78475+00	Amanda	Alto da XV	Waffle de Liege
1095	2026-04-27 16:15:11.436833+00	Amanda	Alto da XV	Nutella - 40gr
1096	2026-04-27 16:15:28.923682+00	Amanda	Alto da XV	Paçoca - 1un
1097	2026-04-27 18:35:23.387847+00	Cassia	Alto da XV	Refri, Chá ou Suco
1098	2026-04-27 19:38:10.054141+00	Sthefani	Ahu	Gelato Carmella - 60gr
1099	2026-04-28 18:33:08.458514+00	Cassia	Alto da XV	Refri, Chá ou Suco
1100	2026-04-28 22:03:52.016444+00	Sthefani	Ahu	Sanduíche de Pernil
1101	2026-04-29 15:52:56.043302+00	Talita	Alto da XV	Refri, Chá ou Suco
1102	2026-04-29 17:34:37.576401+00	Cassia	Alto da XV	Sanduíche de Pernil
1103	2026-04-29 17:34:51.498243+00	Cassia	Alto da XV	Refri, Chá ou Suco
1104	2026-04-29 21:42:02.067179+00	Cassia	Alto da XV	Sanduíche de Mortadela
1105	2026-04-30 15:57:42.087322+00	Talita	Alto da XV	Refri, Chá ou Suco
1106	2026-04-30 16:03:49.634139+00	Marina	Alto da XV	Refri, Chá ou Suco
1107	2026-04-30 16:13:12.26889+00	Amanda	Alto da XV	Waffle de Liege
1108	2026-04-30 16:13:35.098517+00	Amanda	Alto da XV	Nutella - 40gr
1109	2026-04-30 16:14:25.828134+00	Amanda	Alto da XV	Paçoca - 1un
1110	2026-04-30 16:20:31.73663+00	Amanda	Alto da XV	Refri, Chá ou Suco
1111	2026-04-30 16:39:35.363494+00	Sthefani	Ahu	Chocolate Quente
1112	2026-05-01 16:32:10.3934+00	Sthefani	Ahu	Refri, Chá ou Suco
1113	2026-05-01 20:05:23.006368+00	Sthefani	Ahu	Capuccino Brasileiro
1114	2026-05-02 16:05:35.370272+00	Endryw	Ahu	Mocha
1115	2026-05-02 17:32:44.1303+00	Cassia	Alto da XV	Refri, Chá ou Suco
1116	2026-05-02 20:01:05.800395+00	Amanda	Alto da XV	Pequeno ( 1 Sabor )
1117	2026-05-02 21:35:33.049322+00	Cassia	Alto da XV	Capuccino Brasileiro
1118	2026-05-03 15:29:51.44524+00	Amanda	Alto da XV	Pequeno ( 1 Sabor )
1119	2026-05-03 15:30:17.670082+00	Amanda	Alto da XV	Grande ( até 3 Sabores )
1120	2026-05-03 15:59:12.681033+00	Endryw	Ahu	Waffle de Liege
1121	2026-05-03 17:30:55.870828+00	Sthefani	Ahu	Refri, Chá ou Suco
1122	2026-05-03 20:49:13.456419+00	Sthefani	Ahu	Espresso Simples
1123	2026-05-04 15:36:52.152086+00	Sthefani	Ahu	Água
1124	2026-05-04 15:40:01.751046+00	Amanda	Alto da XV	Médio ( até 2 Sabores )
1125	2026-05-04 16:32:29.175068+00	Cassia	Alto da XV	Médio ( até 2 Sabores )
1126	2026-05-04 17:09:04.354507+00	Sthefani	Ahu	Caramel - Latte
1127	2026-05-04 17:36:33.226197+00	Cassia	Alto da XV	Refri, Chá ou Suco
1128	2026-05-04 21:47:15.119477+00	Sthefani	Ahu	Waffle de Liege
1129	2026-05-04 21:47:27.440993+00	Sthefani	Ahu	Waffle de Liege
1130	2026-05-04 21:49:40.44401+00	Sthefani	Ahu	Sanduíche de Pernil
1131	2026-05-05 14:52:38.136348+00	Talita	Alto da XV	Refri, Chá ou Suco
1132	2026-05-05 15:45:54.237246+00	Talita	Alto da XV	Água
1133	2026-05-05 16:15:33.785852+00	Henrique	Alto da XV	Pequeno ( 1 Sabor )
1134	2026-05-05 16:15:46.17526+00	Henrique	Alto da XV	Água
1135	2026-05-05 16:15:55.729028+00	Henrique	Alto da XV	Água
1136	2026-05-05 16:22:54.713678+00	Talita	Alto da XV	Médio ( até 2 Sabores )
1137	2026-05-05 17:30:42.183221+00	Sthefani	Ahu	Refri, Chá ou Suco
1138	2026-05-05 18:31:47.94033+00	Cassia	Alto da XV	Refri, Chá ou Suco
1139	2026-05-05 20:30:05.241034+00	Sthefani	Ahu	Latte
1140	2026-05-06 13:01:13.963097+00	Talita	Alto da XV	Refri, Chá ou Suco
1141	2026-05-06 16:22:17.726273+00	Talita	Alto da XV	Refri, Chá ou Suco
1142	2026-05-06 17:20:55.417331+00	Amanda	Alto da XV	Médio ( até 2 Sabores )
1143	2026-05-06 17:27:32.036562+00	Cassia	Alto da XV	Refri, Chá ou Suco
1144	2026-05-06 19:13:06.48417+00	Henrique	Ahu	Refri, Chá ou Suco
1145	2026-05-06 20:24:48.931388+00	Amanda	Alto da XV	Waffle de Liege
1146	2026-05-06 20:25:04.592627+00	Amanda	Alto da XV	Nutella - 40gr
1147	2026-05-06 20:25:17.545349+00	Amanda	Alto da XV	Paçoca - 1un
1148	2026-05-07 16:00:05.655125+00	Talita	Alto da XV	Água
1149	2026-05-07 16:43:32.449775+00	Talita	Alto da XV	Waffle de Liege
1150	2026-05-07 16:43:45.167842+00	Talita	Alto da XV	Nutella - 40gr
1151	2026-05-07 16:43:57.496893+00	Talita	Alto da XV	Morango - 35gr
1152	2026-05-07 17:27:24.137698+00	Cassia	Alto da XV	Refri, Chá ou Suco
1153	2026-05-07 17:31:18.343021+00	Sthefani	Ahu	Refri, Chá ou Suco
1154	2026-05-07 19:35:55.168644+00	Amanda	Alto da XV	Médio ( até 2 Sabores )
1155	2026-05-07 19:38:09.588274+00	Amanda	Alto da XV	Sanduíche de Mortadela
1156	2026-05-07 19:39:35.028589+00	Amanda	Alto da XV	Refri, Chá ou Suco
1157	2026-05-07 20:00:37.829781+00	Sthefani	Ahu	Latte
1158	2026-05-08 16:06:30.37747+00	Talita	Alto da XV	Refri, Chá ou Suco
1159	2026-05-08 16:06:51.239128+00	Talita	Alto da XV	Sanduíche de Parma
1160	2026-05-08 17:30:13.528155+00	Sthefani	Ahu	Refri, Chá ou Suco
1161	2026-05-08 20:09:29.362265+00	Sthefani	Ahu	Nutella - 40gr
1162	2026-05-08 20:09:46.713683+00	Sthefani	Ahu	Gelato Carmella - 60gr
1163	2026-05-08 20:15:50.288949+00	Sthefani	Ahu	Paçoca - 1un
1164	2026-05-08 20:28:01.145503+00	Endryw	Ahu	Médio ( até 2 Sabores )
1165	2026-05-08 21:46:04.431329+00	Sthefani	Ahu	Água
1166	2026-05-09 15:02:27.501135+00	Endryw	Ahu	Chocolate Quente
1167	2026-05-09 15:05:21.955917+00	Amanda	Alto da XV	Chocolate Quente
1168	2026-05-09 15:10:45.91284+00	Amanda	Alto da XV	Brownie
1169	2026-05-09 15:15:38.915016+00	Cassia	Alto da XV	Capuccino Brasileiro
1170	2026-05-09 18:30:01.941633+00	Cassia	Alto da XV	Refri, Chá ou Suco
1171	2026-05-09 18:33:56.074232+00	Endryw	Ahu	Refri, Chá ou Suco
1172	2026-05-09 19:41:56.805339+00	Endryw	Ahu	Médio ( até 2 Sabores )
1173	2026-05-10 18:50:02.45586+00	Cassia	Alto da XV	Refri, Chá ou Suco
1174	2026-05-10 19:44:00.774946+00	Amanda	Alto da XV	Paçoca - 1un
1175	2026-05-10 19:44:51.307557+00	Henrique	Ahu	Refri, Chá ou Suco
1176	2026-05-10 20:01:34.598754+00	Amanda	Alto da XV	Brownie
1177	2026-05-10 20:40:41.148065+00	Cassia	Alto da XV	Médio ( até 2 Sabores )
1178	2026-05-11 16:02:40.281559+00	Talita	Alto da XV	Refri, Chá ou Suco
1179	2026-05-11 16:47:55.580158+00	Sthefani	Ahu	Sanduíche de Mortadela
1180	2026-05-11 17:24:21.59106+00	Amanda	Alto da XV	Waffle de Liege
1181	2026-05-11 17:24:38.048186+00	Amanda	Alto da XV	Nutella - 40gr
1182	2026-05-11 17:27:31.463287+00	Cassia	Alto da XV	Sanduíche de Carne
1183	2026-05-11 17:34:17.980573+00	Cassia	Alto da XV	Refri, Chá ou Suco
1184	2026-05-11 21:49:24.906134+00	Sthefani	Ahu	Refri, Chá ou Suco
1185	2026-05-11 21:49:35.923893+00	Sthefani	Ahu	Refri, Chá ou Suco
1186	2026-05-12 15:58:42.690941+00	Talita	Alto da XV	Água
1187	2026-05-12 16:25:50.042427+00	Talita	Alto da XV	Vanilla - Latte
1188	2026-05-12 16:27:07.640036+00	Cassia	Alto da XV	Capuccino Brasileiro
1189	2026-05-12 20:11:43.821199+00	Endryw	Ahu	Refri, Chá ou Suco
1190	2026-05-12 22:04:11.02579+00	Sthefani	Ahu	Refri, Chá ou Suco
1191	2026-05-12 22:08:52.287479+00	Endryw	Ahu	Chocolate Quente
1192	2026-05-13 16:27:16.458008+00	Talita	Alto da XV	Refri, Chá ou Suco
1193	2026-05-13 16:47:15.052657+00	Amanda	Alto da XV	Paçoca - 1un
1194	2026-05-13 17:15:48.250278+00	Talita	Alto da XV	Chocolate Quente
1195	2026-05-13 17:41:59.08783+00	Endryw	Ahu	Médio ( até 2 Sabores )
1196	2026-05-13 18:30:53.315569+00	Cassia	Alto da XV	Refri, Chá ou Suco
1197	2026-05-13 18:40:56.879703+00	Endryw	Ahu	Refri, Chá ou Suco
1198	2026-05-13 20:16:01.951081+00	Endryw	Ahu	Refri, Chá ou Suco
1199	2026-05-13 22:04:46.086895+00	Amanda	Alto da XV	Chocolate Quente
1200	2026-05-13 22:06:53.389205+00	Endryw	Ahu	Refri, Chá ou Suco
1201	2026-05-14 14:50:19.08641+00	Cassia	Alto da XV	Capuccino Brasileiro
1202	2026-05-14 15:26:41.466464+00	Endryw	Ahu	Médio ( até 2 Sabores )
1203	2026-05-14 15:56:56.000972+00	Talita	Alto da XV	Refri, Chá ou Suco
1204	2026-05-14 18:27:30.535471+00	Cassia	Alto da XV	Refri, Chá ou Suco
1205	2026-05-14 18:39:12.259621+00	Endryw	Ahu	Refri, Chá ou Suco
1206	2026-05-14 19:04:46.699492+00	Sthefani	Ahu	Refri, Chá ou Suco
1207	2026-05-14 20:39:33.124209+00	Endryw	Ahu	Refri, Chá ou Suco
1208	2026-05-15 14:41:18.645159+00	Endryw	Ahu	Chocolate Quente
1209	2026-05-15 15:57:13.426256+00	Talita	Alto da XV	Refri, Chá ou Suco
1210	2026-05-15 16:48:45.620517+00	Talita	Alto da XV	Waffle de Liege
1211	2026-05-15 16:49:08.496443+00	Talita	Alto da XV	Nutella - 40gr
1212	2026-05-15 16:49:22.492655+00	Talita	Alto da XV	Morango - 35gr
1213	2026-05-15 16:49:53.179434+00	Talita	Alto da XV	Sanduíche de Parma
1214	2026-05-15 17:33:36.587926+00	Sthefani	Ahu	Sanduíche de Carne
1215	2026-05-15 17:35:37.748269+00	Sthefani	Ahu	Chocolate Quente
1216	2026-05-15 20:00:12.451916+00	Amanda	Alto da XV	COMBO SEGUNDA - Nutella e Morango
1217	2026-05-15 21:36:15.406899+00	Sthefani	Ahu	Doce de Leite - 40gr
1218	2026-05-15 21:37:28.069497+00	Sthefani	Ahu	Chocolate Quente
1219	2026-05-16 15:05:16.728357+00	Cassia	Alto da XV	Refri, Chá ou Suco
1220	2026-05-17 17:28:44.341863+00	Cassia	Alto da XV	Refri, Chá ou Suco
1221	2026-05-17 17:29:09.619288+00	Cassia	Alto da XV	Sanduíche de Pernil
1222	2026-05-17 18:33:21.114217+00	Amanda	Alto da XV	Sanduíche de Mortadela
1223	2026-05-17 19:46:50.659915+00	Amanda	Alto da XV	Grande ( até 3 Sabores )
1224	2026-05-17 19:48:04.921482+00	Cassia	Alto da XV	Médio ( até 2 Sabores )
1225	2026-05-17 20:01:17.236954+00	Marina	Alto da XV	Refri, Chá ou Suco
1226	2026-05-17 20:01:33.346724+00	Marina	Alto da XV	Refri, Chá ou Suco
1227	2026-05-17 21:58:11.102971+00	Sthefani	Ahu	Capuccino Brasileiro
1228	2026-05-18 16:05:49.120622+00	Talita	Alto da XV	Refri, Chá ou Suco
1229	2026-05-18 17:36:39.162849+00	Cassia	Alto da XV	Refri, Chá ou Suco
1230	2026-05-18 18:31:37.156751+00	Amanda	Alto da XV	Waffle de Liege
1231	2026-05-18 18:31:52.116558+00	Amanda	Alto da XV	Nutella - 40gr
1232	2026-05-18 18:32:05.312647+00	Amanda	Alto da XV	Paçoca - 1un
1233	2026-05-18 21:35:08.055277+00	Sthefani	Ahu	COMBO SEGUNDA - Nutella e Morango
1234	2026-05-18 21:36:44.898026+00	Sthefani	Ahu	Latte
1235	2026-05-18 21:37:20.49563+00	Sthefani	Ahu	Gelato Carmella - 60gr
1236	2026-05-18 21:37:34.659398+00	Sthefani	Ahu	Gelato Carmella - 60gr
1237	2026-05-18 21:40:38.277892+00	Sthefani	Ahu	Espresso Duplo
1238	2026-05-18 21:56:03.986003+00	Sthefani	Ahu	Cascão Unitário
1239	2026-05-18 22:02:53.494754+00	Sthefani	Ahu	Refri, Chá ou Suco
1240	2026-05-18 22:03:25.03999+00	Sthefani	Ahu	Refri, Chá ou Suco
1241	2026-05-19 19:59:19.493561+00	Cassia	Alto da XV	Refri, Chá ou Suco
1242	2026-05-20 12:06:55.402759+00	Talita	Alto da XV	Água
1243	2026-05-20 15:29:03.26757+00	Amanda	Alto da XV	Médio ( até 2 Sabores )
1244	2026-05-20 16:00:30.038165+00	Cassia	Alto da XV	Médio ( até 2 Sabores )
1245	2026-05-20 16:09:22.939359+00	Talita	Alto da XV	Refri, Chá ou Suco
1246	2026-05-20 16:34:07.554861+00	Talita	Alto da XV	Waffle de Liege
1247	2026-05-20 16:34:20.661098+00	Talita	Alto da XV	Nutella - 40gr
1248	2026-05-20 16:34:33.897967+00	Talita	Alto da XV	Morango - 35gr
1249	2026-05-20 17:12:36.146069+00	Endryw	Ahu	Refri, Chá ou Suco
1250	2026-05-20 20:28:19.555893+00	Amanda	Alto da XV	Brownie
1251	2026-05-20 21:25:37.470617+00	Endryw	Ahu	Grande ( até 3 Sabores )
1252	2026-05-20 21:27:27.750757+00	Endryw	Ahu	Refri, Chá ou Suco
1253	2026-05-21 15:52:16.722675+00	Talita	Alto da XV	Refri, Chá ou Suco
1254	2026-05-21 16:12:53.985226+00	Amanda	Alto da XV	Brownie
1255	2026-05-21 17:36:57.434785+00	Talita	Alto da XV	Médio ( até 2 Sabores )
1256	2026-05-21 18:29:51.41584+00	Cassia	Alto da XV	Refri, Chá ou Suco
1257	2026-05-21 21:41:29.895251+00	Endryw	Ahu	Refri, Chá ou Suco
1258	2026-05-22 16:04:04.96817+00	Talita	Alto da XV	Refri, Chá ou Suco
1259	2026-05-22 16:04:24.83806+00	Talita	Alto da XV	Sanduíche de Parma
1260	2026-05-22 19:51:37.963636+00	Sthefani	Ahu	Latte
1261	2026-05-23 17:31:45.953986+00	Sthefani	Ahu	COMBO SEGUNDA - Nutella e Morango
1262	2026-05-23 17:32:53.429518+00	Cassia	Alto da XV	Sanduíche de Carne
1263	2026-05-24 15:12:32.249896+00	Amanda	Alto da XV	Waffle de Liege
1264	2026-05-24 15:12:49.608166+00	Amanda	Alto da XV	Nutella - 40gr
1265	2026-05-24 15:13:09.751163+00	Amanda	Alto da XV	Morango - 35gr
1266	2026-05-24 15:14:13.325603+00	Amanda	Alto da XV	Caramel - Latte
1267	2026-05-24 17:32:05.299679+00	Sthefani	Ahu	Refri, Chá ou Suco
1268	2026-05-24 18:28:57.952419+00	Cassia	Alto da XV	Refri, Chá ou Suco
1269	2026-05-25 15:24:37.122748+00	Amanda	Alto da XV	Médio ( até 2 Sabores )
1270	2026-05-25 16:06:22.593878+00	Talita	Alto da XV	Água
1271	2026-05-25 16:37:54.489703+00	Cassia	Alto da XV	COMBO SEGUNDA - Nutella e Morango
1272	2026-05-25 16:44:36.536822+00	Talita	Alto da XV	COMBO SEGUNDA - Nutella e Morango
1273	2026-05-25 17:54:29.16272+00	Sthefani	Ahu	Refri, Chá ou Suco
1274	2026-05-25 19:49:05.90041+00	Amanda	Alto da XV	Sanduíche de Mortadela
1275	2026-05-25 19:49:20.448775+00	Amanda	Alto da XV	Refri, Chá ou Suco
1276	2026-05-26 16:28:20.791345+00	Talita	Alto da XV	Refri, Chá ou Suco
1277	2026-05-26 17:36:31.331634+00	Cassia	Alto da XV	Refri, Chá ou Suco
1278	2026-05-26 17:37:46.644509+00	Sthefani	Ahu	Refri, Chá ou Suco
1279	2026-05-26 17:54:06.2462+00	Endryw	Ahu	Médio ( até 2 Sabores )
1280	2026-05-26 22:01:56.200945+00	Endryw	Ahu	Waffle de Liege
1281	2026-05-26 22:02:10.104609+00	Endryw	Ahu	Nutella - 40gr
1282	2026-05-26 22:02:21.482463+00	Endryw	Ahu	Nutella - 40gr
1283	2026-05-27 15:37:38.264872+00	Amanda	Alto da XV	Refri, Chá ou Suco
1284	2026-05-27 15:55:47.402777+00	Amanda	Alto da XV	Brownie
1285	2026-05-27 16:04:00.279055+00	Talita	Alto da XV	Refri, Chá ou Suco
1286	2026-05-27 16:04:17.739595+00	Talita	Alto da XV	Sanduíche de Parma
1287	2026-05-27 17:15:05.413201+00	Endryw	Ahu	Refri, Chá ou Suco
1288	2026-05-27 17:27:28.652184+00	Cassia	Alto da XV	Refri, Chá ou Suco
1289	2026-05-27 19:36:09.896636+00	Endryw	Ahu	Refri, Chá ou Suco
1290	2026-05-27 20:03:46.557099+00	Endryw	Ahu	Refri, Chá ou Suco
1291	2026-05-28 15:39:44.39973+00	Endryw	Ahu	Affogato
1292	2026-05-28 15:58:57.649143+00	Talita	Alto da XV	Refri, Chá ou Suco
1293	2026-05-28 17:28:43.600643+00	Amanda	Alto da XV	COMBO SEGUNDA - Nutella e Morango
1294	2026-05-28 18:32:52.769426+00	Sthefani	Ahu	Latte
1295	2026-05-28 18:34:22.882186+00	Cassia	Alto da XV	Refri, Chá ou Suco
1296	2026-05-28 21:45:03.826892+00	Sthefani	Ahu	Gelato Carmella - 60gr
1297	2026-05-28 21:58:32.670817+00	Sthefani	Ahu	Refri, Chá ou Suco
1298	2026-05-28 21:58:49.62227+00	Sthefani	Ahu	Refri, Chá ou Suco
1299	2026-05-29 14:43:25.784386+00	Sthefani	Ahu	Latte
1300	2026-05-29 16:00:31.762737+00	Talita	Alto da XV	Refri, Chá ou Suco
1301	2026-05-29 16:59:43.367014+00	Talita	Alto da XV	Affogato
1302	2026-05-29 17:21:31.860825+00	Sthefani	Ahu	Água
1303	2026-05-29 21:53:58.094877+00	Amanda	Alto da XV	Waffle de Liege
1304	2026-05-29 21:54:10.324602+00	Amanda	Alto da XV	Nutella - 40gr
1305	2026-05-30 15:08:03.21058+00	Sthefani	Ahu	Mocha
1306	2026-05-30 18:34:14.349761+00	Cassia	Alto da XV	Refri, Chá ou Suco
1307	2026-05-31 14:56:16.386118+00	Sthefani	Ahu	Latte
1308	2026-05-31 15:13:29.039176+00	Sthefani	Ahu	Doce de Leite - 40gr
1309	2026-05-31 16:27:08.27319+00	Endryw	Ahu	Affogato
1310	2026-05-31 16:30:12.672204+00	Cassia	Alto da XV	Refri, Chá ou Suco
1311	2026-05-31 16:34:41.61927+00	Sthefani	Ahu	Refri, Chá ou Suco
1312	2026-05-31 17:36:54.852235+00	Endryw	Ahu	Refri, Chá ou Suco
1313	2026-05-31 22:17:03.50959+00	Sthefani	Ahu	Capuccino Brasileiro
1314	2026-05-31 22:21:34.291322+00	Endryw	Ahu	Pote 480ml
1315	2026-05-31 22:21:44.941414+00	Endryw	Ahu	Refri, Chá ou Suco
\.


--
-- Data for Name: Vouchers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."Vouchers" ("id", "created_at", "voucher_id", "active", "date_consumed", "store_consumed", "person_consumed", "value") FROM stdin;
7	2025-03-24 14:00:20.827789+00	Marcos Roberto dos Santos	f	2025-04-04 20:21:47.691	Ahu	Henrique	Um Gelato Médio
6	2025-03-24 13:55:39.316095+00	Riad Farhat	f	2025-05-01 19:57:05.407	Ahu	Henrique	Um Gelato Médio
10	2025-06-10 16:39:58.957746+00	Luciene-10	f	2025-06-11 15:21:09.588	Ahu	Arielle	1x Espresso Duplo
9	2025-06-08 21:21:53.304967+00	DANIEL-2913	f	2025-08-10 20:12:26.752	Ahu	Henrique	1 GELATO MÉDIO
11	2025-08-10 20:16:09.348336+00	Tatiana Muggiati	f	2025-09-06 16:01:11.36	Ahu	Arielle	1 Gelato Médio
12	2025-09-23 15:33:16.795738+00	Curitibachei	t	\N	\N	\N	30% de desconto
1	2025-02-21 09:46:45+00	CLAUDIA10-21	f	2025-09-23 15:41:17.422	Batel	Henrique	Um gelato pequeno
13	2025-10-22 19:15:42.928035+00	teste	f	2025-10-22 19:28:26.167	Ahu	Henrique	\N
16	2025-12-16 20:40:54.083601+00	BEA1612	f	2026-01-08 19:06:38.724	Ahu	Sthefani	1 Gelato Médio
17	2025-12-16 20:41:04.067742+00	FAT1612	f	2026-05-27 03:26:49.557	Ahu	Henrique	1 Gelato Médio
15	2025-12-16 20:40:42.550869+00	KEL1612	f	2026-05-27 03:26:51.689	Ahu	Henrique	1 Gelato Médio
14	2025-12-16 20:40:21.633879+00	TAN1612	f	2026-05-27 03:26:54.529	Ahu	Henrique	1 Gelato Médio
18	2026-05-27 03:26:03.892888+00	RFL2705	t	\N	\N	\N	1 Affogato Grátis
\.


--
-- Data for Name: afericao_porcao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."afericao_porcao" ("id", "unit", "employee_name", "cup_number", "portion_label", "weight_grams", "created_at") FROM stdin;
e46534c0-449e-4bf8-b0b8-9690459554b5	ahu	Henrique	1	1 porção de 70g na espátula do sabor Baunilha	69	2026-02-16 12:58:31.675+00
2f85e6ad-ec28-4c04-91ea-42a226b1a05f	ahu	Henrique	2	1 copinho pequeno de 120g do sabor Baunilha	135	2026-02-16 12:58:31.675+00
99ed79d6-71a2-4778-8b4a-504a76bf5c29	ahu	Henrique	3	1 copinho médio de 140g do sabor Baunilha	140	2026-02-16 12:58:31.675+00
8dcd598d-6c46-47f9-b97d-9337239a7d20	ahu	Henrique	1	1 porção de 70g na espátula do sabor Baunilha	65	2026-03-19 19:12:08.328+00
2e43ffe7-17c3-4daf-919b-28fcc741f7ef	ahu	Henrique	2	1 copinho pequeno de 120g do sabor Baunilha	115	2026-03-19 19:12:08.328+00
cce272e2-37b0-43ab-887c-36563e96750b	ahu	Henrique	3	1 copinho médio de 140g do sabor Baunilha	140	2026-03-19 19:12:08.328+00
89be279b-594b-410b-b0e0-fd43731b93d3	Alto XV	Henrique	1	1 porção de 70g na espátula do sabor Baunilha	22	2026-03-19 19:31:37.576+00
d8f1ffac-3239-4f8d-948d-670865eb530c	Alto XV	Henrique	2	1 copinho pequeno de 120g do sabor Baunilha	123	2026-03-19 19:31:37.576+00
6d77f975-7798-414e-bb56-8097f620567b	Alto XV	Henrique	3	1 copinho médio de 140g do sabor Baunilha	3123	2026-03-19 19:31:37.576+00
733eecfa-8d6b-4827-bfeb-d0a4e9c21928	ahu	Sthefani	1	1 porção de 70g na espátula do sabor Baunilha	94	2026-03-20 19:47:59.958+00
5c043f8e-5d15-4ec8-834e-3a8c1d6f1356	ahu	Sthefani	2	1 copinho pequeno de 120g do sabor Baunilha	114	2026-03-20 19:47:59.958+00
f5fb09de-92e6-4b6f-b8b1-a5c70c6daded	ahu	Sthefani	3	1 copinho médio de 140g do sabor Baunilha	150	2026-03-20 19:47:59.958+00
9aafd7ad-37bd-49ff-aa7c-179d6716a6e3	ahu	Arielle	1	1 porção de 70g na espátula do sabor Baunilha	85	2026-03-20 19:53:31.226+00
501aa2a8-3687-492a-9abc-a7b914e402bb	ahu	Arielle	2	1 copinho pequeno de 120g do sabor Baunilha	117	2026-03-20 19:53:31.226+00
b08e8bba-9d71-41a6-a106-2ad9a39d3fd4	ahu	Arielle	3	1 copinho médio de 140g do sabor Baunilha	150	2026-03-20 19:53:31.226+00
dba65d91-3b11-4a8d-9b59-9e2a9d03d7e0	Alto XV	Lidiane	1	1 porção de 70g na espátula do sabor Baunilha	79	2026-03-20 20:27:17.64+00
77e88791-88ff-4aff-bb52-cdc81643fd6b	Alto XV	Lidiane	2	1 copinho pequeno de 120g do sabor Baunilha	129	2026-03-20 20:27:17.64+00
8539f2d8-bd84-45a8-bf90-51e11ebff016	Alto XV	Lidiane	3	1 copinho médio de 140g do sabor Baunilha	153	2026-03-20 20:27:17.64+00
42ff809b-c98d-419d-bccd-7b9b64d3d7b3	ahu	Sthefani	1	1 porção de 70g na espátula do sabor Baunilha	85	2026-03-21 15:08:15.36+00
8a15c5cc-251d-4a0a-b736-05812ead3f9a	ahu	Sthefani	2	1 copinho pequeno de 120g do sabor Baunilha	122	2026-03-21 15:08:15.36+00
3d4b7aed-bb7a-465c-a75a-986550ee0eec	ahu	Sthefani	3	1 copinho médio de 140g do sabor Baunilha	166	2026-03-21 15:08:15.36+00
f51d7a1c-1ffc-4e68-9f00-043c4d01d087	ahu	Arielle	1	1 porção de 70g na espátula do sabor Baunilha	90	2026-03-21 15:11:39.186+00
ac5d5f2b-a0dc-4cc0-a321-d17521c0c4d8	ahu	Arielle	2	1 copinho pequeno de 120g do sabor Baunilha	137	2026-03-21 15:11:39.186+00
5164fccc-c187-4eb8-b5df-277cc4cb19da	ahu	Arielle	3	1 copinho médio de 140g do sabor Baunilha	161	2026-03-21 15:11:39.186+00
76979a0a-5f05-4a89-b38a-e0f6327bc875	ahu	Arielle	1	1 porção de 70g na espátula do sabor Baunilha	90	2026-03-21 15:14:20.981+00
5f669ea8-676d-45b8-b2b3-98c6c7b375a5	ahu	Arielle	2	1 copinho pequeno de 120g do sabor Baunilha	137	2026-03-21 15:14:20.981+00
c924496f-9160-48db-8d56-80f0709638e3	ahu	Arielle	3	1 copinho médio de 140g do sabor Baunilha	161	2026-03-21 15:14:20.981+00
80e4b411-9eea-42f1-a2a9-6d92ee4e482b	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	69	2026-03-21 15:18:57.242+00
f0fbe2fb-3b63-4e86-98fd-c2b6ddcf2e30	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	135	2026-03-21 15:18:57.242+00
47af1958-fa80-4401-87a0-77efbbc2d5c1	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	144	2026-03-21 15:18:57.242+00
66d80da4-0551-4e57-b915-eb74a62c72a1	Alto XV	Lidiane	1	1 porção de 70g na espátula do sabor Baunilha	91	2026-03-21 15:22:41.072+00
faff0ca5-7a56-488a-acad-d4be1ede454e	Alto XV	Lidiane	2	1 copinho pequeno de 120g do sabor Baunilha	141	2026-03-21 15:22:41.072+00
07c7d906-f8c6-41f6-9d47-0e8c43449607	Alto XV	Lidiane	3	1 copinho médio de 140g do sabor Baunilha	123	2026-03-21 15:22:41.072+00
ad7ada8b-cd25-4499-95de-00d00d4f8edb	Alto XV	Endryw	1	1 porção de 70g na espátula do sabor Baunilha	85	2026-03-21 15:55:32.786+00
174e5749-81a4-440d-8790-cc37cdb33849	Alto XV	Endryw	2	1 copinho pequeno de 120g do sabor Baunilha	126	2026-03-21 15:55:32.786+00
bd354360-9a91-44f9-86eb-8f18232bc9a1	Alto XV	Endryw	3	1 copinho médio de 140g do sabor Baunilha	145	2026-03-21 15:55:32.786+00
b58e918e-7eec-49c3-a0d9-2812810ea3b8	ahu	Arielle	1	1 porção de 70g na espátula do sabor Baunilha	95	2026-03-22 15:05:25.888+00
be1307cd-e2d4-49a0-a5be-23a03307fcfa	ahu	Arielle	2	1 copinho pequeno de 120g do sabor Baunilha	119	2026-03-22 15:05:25.888+00
05db00ec-5e0a-40df-a065-0b7cc4916b71	ahu	Arielle	3	1 copinho médio de 140g do sabor Baunilha	136	2026-03-22 15:05:25.888+00
20016f2e-5d11-4869-9eb2-1a6aae4c7484	ahu	Sthefani	1	1 porção de 70g na espátula do sabor Baunilha	83	2026-03-22 15:16:18.56+00
907f12ad-a4cd-46d7-9254-4fdb0cf1561a	ahu	Sthefani	2	1 copinho pequeno de 120g do sabor Baunilha	110	2026-03-22 15:16:18.56+00
725337aa-a266-4f99-97d2-227648adeff3	ahu	Sthefani	3	1 copinho médio de 140g do sabor Baunilha	140	2026-03-22 15:16:18.56+00
e5f752f5-b481-4d89-832f-f2a681d44f91	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	86	2026-03-22 16:59:22.069+00
239faba5-ba58-41dc-80b0-ac7f4775cff8	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	116	2026-03-22 16:59:22.069+00
97dd6970-9fb7-4c6d-9d98-c5994b6df5f8	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	130	2026-03-22 16:59:22.069+00
de7249e7-4dfc-42a2-a0e6-c99d350cb48d	Alto XV	Lidiane	1	1 porção de 70g na espátula do sabor Baunilha	77	2026-03-22 17:50:48.521+00
03b0898d-9e0c-4df9-b54a-be94422aec9c	Alto XV	Lidiane	2	1 copinho pequeno de 120g do sabor Baunilha	133	2026-03-22 17:50:48.521+00
e5955aab-5aec-483a-92fb-5863af7bc9ea	Alto XV	Lidiane	3	1 copinho médio de 140g do sabor Baunilha	139	2026-03-22 17:50:48.521+00
77124905-7f6c-426d-a907-edc2bbe14145	ahu	Sthefani	1	1 porção de 70g na espátula do sabor Baunilha	90	2026-03-23 15:01:25.477+00
2d16a0cf-1041-4a3e-9b80-7f70008fb070	ahu	Sthefani	2	1 copinho pequeno de 120g do sabor Baunilha	125	2026-03-23 15:01:25.477+00
3068d4b9-733b-4a06-85d8-296f70936315	ahu	Sthefani	3	1 copinho médio de 140g do sabor Baunilha	154	2026-03-23 15:01:25.477+00
feb80293-c402-4724-bb97-9a32ecc13c73	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	100	2026-03-23 15:10:37.657+00
45722547-3958-4c26-a6cf-76c03b4c75e6	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	124	2026-03-23 15:10:37.657+00
b0b274be-df53-4445-b03f-1b32bcb5ec64	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	168	2026-03-23 15:10:37.657+00
b4984606-31ae-4853-a09e-94b735e3e5c3	ahu	Arielle	1	1 porção de 70g na espátula do sabor Baunilha	85	2026-03-23 15:10:50.699+00
c22b8c4e-b90f-4b65-8ecb-ce68e6a2f779	ahu	Arielle	2	1 copinho pequeno de 120g do sabor Baunilha	120	2026-03-23 15:10:50.699+00
0b55f6f5-5079-471c-bb90-a597ef1dc7d8	ahu	Arielle	3	1 copinho médio de 140g do sabor Baunilha	143	2026-03-23 15:10:50.699+00
d5c19760-b751-415a-b181-68f8f113d478	Alto XV	Lidiane	1	1 porção de 70g na espátula do sabor Baunilha	86	2026-03-23 15:15:05.111+00
56178060-ba22-407b-9dc2-eda4e1e8d314	Alto XV	Lidiane	2	1 copinho pequeno de 120g do sabor Baunilha	121	2026-03-23 15:15:05.111+00
11ee5ae6-a192-4315-a7f2-a6a331e1d9b0	Alto XV	Lidiane	3	1 copinho médio de 140g do sabor Baunilha	148	2026-03-23 15:15:05.111+00
1cc0c6a6-b3bd-42cf-ad3a-2126d0d9cf38	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	81	2026-03-24 15:24:09.803+00
557e773b-003a-4c8c-8d94-97d2406a6cf6	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	120	2026-03-24 15:24:09.803+00
6bc85599-c4c2-4978-bb12-e1c45187029d	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	160	2026-03-24 15:24:09.803+00
180215c6-850d-42c0-993e-fcbcc3c72e5a	Alto XV	Endryw	1	1 porção de 70g na espátula do sabor Baunilha	78	2026-03-24 15:32:54.604+00
84b8a3b3-86d5-47f0-85c6-7a6ac8377584	Alto XV	Endryw	2	1 copinho pequeno de 120g do sabor Baunilha	136	2026-03-24 15:32:54.604+00
01a4fcf9-0400-4e98-9c86-d8ab830db2cc	Alto XV	Endryw	3	1 copinho médio de 140g do sabor Baunilha	135	2026-03-24 15:32:54.604+00
f67375e0-e8f1-4c68-aa2c-fbe6cc9874e1	ahu	Sthefani	1	1 porção de 70g na espátula do sabor Baunilha	82	2026-03-24 15:58:25.985+00
017fee0d-4e1b-4be4-8302-42771a0607fb	ahu	Sthefani	2	1 copinho pequeno de 120g do sabor Baunilha	120	2026-03-24 15:58:25.985+00
ba4bd23b-d276-4b79-be04-ba9df1976f9b	ahu	Sthefani	3	1 copinho médio de 140g do sabor Baunilha	151	2026-03-24 15:58:25.985+00
1ebcd20f-d4c3-4f00-802a-8b91221b77fd	ahu	Arielle	1	1 porção de 70g na espátula do sabor Baunilha	79	2026-03-24 16:05:01.333+00
b5fd80a8-1870-4856-80a8-e2e70a502a3f	ahu	Arielle	2	1 copinho pequeno de 120g do sabor Baunilha	121	2026-03-24 16:05:01.333+00
4c00826e-a93f-4ce9-b6a9-3743761e0b27	ahu	Arielle	3	1 copinho médio de 140g do sabor Baunilha	140	2026-03-24 16:05:01.333+00
d74af7b4-8630-48c4-8ca9-ca283055336f	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	70	2026-03-25 15:25:47.94+00
f95dacce-aaa1-47e2-8b56-7440ebe124f2	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	104	2026-03-25 15:25:47.94+00
225b364e-6d94-4aa4-9bde-7fb092f68385	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	148	2026-03-25 15:25:47.94+00
f68165d3-3432-4d65-bfc0-e296e8027e31	Alto XV	Lidiane	1	1 porção de 70g na espátula do sabor Baunilha	77	2026-03-25 15:29:56.823+00
2ab72a90-6dc2-4e4c-bd08-3dea0fd2f5a0	Alto XV	Lidiane	2	1 copinho pequeno de 120g do sabor Baunilha	126	2026-03-25 15:29:56.823+00
677cf996-4fb7-4cd5-9147-b39710a88579	Alto XV	Lidiane	3	1 copinho médio de 140g do sabor Baunilha	143	2026-03-25 15:29:56.823+00
bd33408d-0c75-4358-ac06-65a47d460bc0	ahu	Sthefani	1	1 porção de 70g na espátula do sabor Baunilha	78	2026-03-26 16:21:00.742+00
94f30a29-2ad0-4777-9827-7a0b7132ce71	ahu	Sthefani	2	1 copinho pequeno de 120g do sabor Baunilha	112	2026-03-26 16:21:00.742+00
85f6cf59-679f-4200-b3ea-a31537bbbb55	ahu	Sthefani	3	1 copinho médio de 140g do sabor Baunilha	140	2026-03-26 16:21:00.742+00
124b07c0-e181-488a-b1f2-8251f701a2c8	ahu	Endryw	1	1 porção de 70g na espátula do sabor Baunilha	77	2026-03-26 16:24:15.453+00
44cf9e9c-8bf7-4221-a445-bec1e4021ed8	ahu	Endryw	2	1 copinho pequeno de 120g do sabor Baunilha	130	2026-03-26 16:24:15.453+00
47863bbf-8ece-4719-b704-64cb332573b4	ahu	Endryw	3	1 copinho médio de 140g do sabor Baunilha	149	2026-03-26 16:24:15.453+00
3db5bf40-497a-4920-b611-c7a655593d3f	ahu	Sthefani	1	1 porção de 70g na espátula do sabor Baunilha	80	2026-03-28 15:14:21.045+00
8910f7ee-1c3a-4bcb-9473-f06abdc5b02b	ahu	Sthefani	2	1 copinho pequeno de 120g do sabor Baunilha	125	2026-03-28 15:14:21.045+00
98f40353-5205-455d-88d1-f9d39f0b1ab3	ahu	Sthefani	3	1 copinho médio de 140g do sabor Baunilha	150	2026-03-28 15:14:21.045+00
bad7ceb7-d3ae-4605-a94a-02b1c0f7e056	ahu	Endryw	1	1 porção de 70g na espátula do sabor Baunilha	79	2026-03-28 15:19:14.186+00
59886248-ff3b-484f-ac88-9184b11c0e6b	ahu	Endryw	2	1 copinho pequeno de 120g do sabor Baunilha	134	2026-03-28 15:19:14.186+00
4e2c876d-616f-4b7a-98cd-1d75ba1edbe9	ahu	Endryw	3	1 copinho médio de 140g do sabor Baunilha	141	2026-03-28 15:19:14.186+00
5cff13ed-3288-4832-aa90-8a6c2f20273f	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	77	2026-03-28 16:21:46.639+00
cd3ae5b8-5000-453e-8bea-597718d7d21b	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	106	2026-03-28 16:21:46.639+00
9d018d49-439e-45cd-8139-b370b45ed132	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	177	2026-03-28 16:21:46.639+00
414a8497-69e4-4952-973c-7abbf392ecd8	Alto XV	Lidiane	1	1 porção de 70g na espátula do sabor Baunilha	74	2026-03-28 17:43:09.545+00
963867b4-a592-43a9-b3d0-ec5612b210af	Alto XV	Lidiane	2	1 copinho pequeno de 120g do sabor Baunilha	118	2026-03-28 17:43:09.545+00
0c1b5e95-1b2b-4ab0-afd1-ef090494e265	Alto XV	Lidiane	3	1 copinho médio de 140g do sabor Baunilha	155	2026-03-28 17:43:09.545+00
38519260-0347-40e8-91dc-67bd4e4079b2	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	90	2026-03-29 16:14:34.324+00
2f24e495-598c-4545-b70b-b91e7c8cb801	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	130	2026-03-29 16:14:34.324+00
1e4cee14-6616-47cb-b0cb-750a75b788cf	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	137	2026-03-29 16:14:34.324+00
fa00bbb2-e6ae-4467-afcd-97a81ff075bc	Alto XV	Arielle	1	1 porção de 70g na espátula do sabor Baunilha	90	2026-03-29 16:15:01.466+00
8be79654-f10a-45d3-9d39-69883bd6e918	Alto XV	Arielle	2	1 copinho pequeno de 120g do sabor Baunilha	117	2026-03-29 16:15:01.466+00
bd29ddeb-9f7f-44ab-8d21-a174e973bc1c	Alto XV	Arielle	3	1 copinho médio de 140g do sabor Baunilha	149	2026-03-29 16:15:01.466+00
dec38ae1-7020-4655-83d2-d3e2837122f9	ahu	Sthefani	1	1 porção de 70g na espátula do sabor Baunilha	72	2026-03-30 15:48:32.413+00
4f376fd1-6a9f-4c8f-89f3-2a2e9d94d11e	ahu	Sthefani	2	1 copinho pequeno de 120g do sabor Baunilha	125	2026-03-30 15:48:32.413+00
85c19a39-eaa3-4203-a19a-f3147531a996	ahu	Sthefani	3	1 copinho médio de 140g do sabor Baunilha	147	2026-03-30 15:48:32.413+00
794c5b24-c80c-4ddd-89b5-e36ba0a05652	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	71	2026-04-01 15:03:29.109+00
21a88766-e7f3-44dc-8d56-e4e25a0d000e	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	128	2026-04-01 15:03:29.109+00
98ee257a-9107-494d-aa95-bb3b19a7875e	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	152	2026-04-01 15:03:29.109+00
a8dd41ba-387e-4e51-b9a7-a35719ad8d18	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	70	2026-04-01 17:25:38.907+00
75c70b30-6c90-4f1a-93c7-28d3f6fbd643	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	140	2026-04-01 17:25:38.907+00
83f85264-9769-4a10-984a-e83176bef29b	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	138	2026-04-01 17:25:38.907+00
1f135c9d-3f6a-4cab-8559-4f38986487bf	ahu	Sthefani	1	1 porção de 70g na espátula do sabor Baunilha	64	2026-04-04 15:13:20.375+00
4aeecff1-3568-4ae6-8fd4-538db9a7066c	ahu	Sthefani	2	1 copinho pequeno de 120g do sabor Baunilha	115	2026-04-04 15:13:20.375+00
6f61f98b-bd82-418d-82a5-f4fb35ce4674	ahu	Sthefani	3	1 copinho médio de 140g do sabor Baunilha	145	2026-04-04 15:13:20.375+00
1e9b2e46-72c6-4081-9678-118c9b4aed5d	ahu	Endryw	1	1 porção de 70g na espátula do sabor Baunilha	75	2026-04-04 15:17:45.738+00
049f8e87-04ab-4e99-9d4b-c284b888c7b6	ahu	Endryw	2	1 copinho pequeno de 120g do sabor Baunilha	126	2026-04-04 15:17:45.738+00
8d9a0009-8bf8-44b4-8a3f-d6c2325e1f50	ahu	Endryw	3	1 copinho médio de 140g do sabor Baunilha	152	2026-04-04 15:17:45.738+00
a96bcc08-bb9a-49be-afbf-e03617c4951d	ahu	Sthefani	1	1 porção de 70g na espátula do sabor Baunilha	82	2026-04-05 14:48:44.156+00
08dbccc6-d7b8-434d-9004-00a854fab5b7	ahu	Sthefani	2	1 copinho pequeno de 120g do sabor Baunilha	127	2026-04-05 14:48:44.156+00
24c13207-6e85-458f-8776-6aad79d17f0e	ahu	Sthefani	3	1 copinho médio de 140g do sabor Baunilha	154	2026-04-05 14:48:44.156+00
81c01409-f9a8-4444-a4d8-a87b5d6a3938	ahu	Endryw	1	1 porção de 70g na espátula do sabor Baunilha	65	2026-04-05 14:52:05.711+00
93ecff13-36b8-40f9-9216-76daacd141b8	ahu	Endryw	2	1 copinho pequeno de 120g do sabor Baunilha	133	2026-04-05 14:52:05.711+00
81bd5db1-07ec-4068-86bf-ed1bb5e77690	ahu	Endryw	3	1 copinho médio de 140g do sabor Baunilha	135	2026-04-05 14:52:05.711+00
d6b4d4d9-0cb1-41e4-9e3b-8b23006c627c	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	68	2026-04-06 15:06:32.6+00
22c79e53-9c39-49e4-b07e-42c33a065c2d	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	118	2026-04-06 15:06:32.6+00
cbdb6ff7-2328-4e67-b3a5-d46ec5aae87c	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	140	2026-04-06 15:06:32.6+00
c50f1e14-4a75-4d5e-9eee-3c851defb275	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	68	2026-04-06 15:08:42.869+00
ce22dad1-5c02-4592-8ec0-73a04de9c91b	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	120	2026-04-06 15:08:42.869+00
e56d6b49-a31a-4476-9160-a8bbc47c5382	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	139	2026-04-06 15:08:42.869+00
bfc9dc44-a0c1-47d1-99e0-dd2614dd3c88	ahu	Sthefani	1	1 porção de 70g na espátula do sabor Baunilha	79	2026-04-06 15:11:36.4+00
fbfe3f14-9973-4117-956e-2d7548f7d706	ahu	Sthefani	2	1 copinho pequeno de 120g do sabor Baunilha	123	2026-04-06 15:11:36.4+00
0902c4ce-04dd-4ec3-a5a6-7f0256ccba2f	ahu	Sthefani	3	1 copinho médio de 140g do sabor Baunilha	140	2026-04-06 15:11:36.4+00
96e7a06a-f6c1-4203-bfb3-89754c3da6dd	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	70	2026-04-08 14:54:46.491+00
cb57929f-19b6-4f4c-8ec9-37fe3d23628e	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	113	2026-04-08 14:54:46.491+00
cfda0bb6-43ec-49ca-b4a8-0364fd3735f0	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	172	2026-04-08 14:54:46.491+00
e2cf3c75-0fed-4db7-ad9f-9a368d5b2a02	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	72	2026-04-08 14:58:34.454+00
03eb9c29-5239-4e39-89a2-07ed87f19ac0	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	128	2026-04-08 14:58:34.454+00
c3944453-b35e-43f9-a079-aba6ab44b275	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	157	2026-04-08 14:58:34.454+00
b8982ca8-50c1-4ed2-9c83-bd1247df6188	ahu	Sthefani	1	1 porção de 70g na espátula do sabor Baunilha	79	2026-04-10 15:01:13.566+00
7280db24-1a5b-477e-aba0-b9aeba39a71f	ahu	Sthefani	2	1 copinho pequeno de 120g do sabor Baunilha	121	2026-04-10 15:01:13.566+00
dd620bdc-605c-475c-a335-4ee3fb9a2b90	ahu	Sthefani	3	1 copinho médio de 140g do sabor Baunilha	148	2026-04-10 15:01:13.566+00
4881135f-374a-4fa1-beaf-d8c4452c0c26	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	70	2026-04-13 14:30:28.897+00
7de1a543-ceea-4af9-9abb-f12cb1da9ef2	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	119	2026-04-13 14:30:28.897+00
56a9fd72-dca2-4541-b78a-e9c97a201412	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	137	2026-04-13 14:30:28.897+00
a0728f8f-ae29-4e09-b511-d98464a50bd9	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	71	2026-04-13 14:34:32.429+00
640908ee-9a86-455c-a89d-a52dc8063181	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	117	2026-04-13 14:34:32.429+00
390e2ef5-fa9a-49c9-82a4-83114494ac1a	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	142	2026-04-13 14:34:32.429+00
80aa1e16-6051-4419-8b74-96b5a4e43ec1	ahu	Sthefani	1	1 porção de 70g na espátula do sabor Baunilha	69	2026-04-13 15:44:04.437+00
7121286c-a37f-491a-84a6-4a4a1d806172	ahu	Sthefani	2	1 copinho pequeno de 120g do sabor Baunilha	115	2026-04-13 15:44:04.437+00
62408633-7d5a-4f12-a17a-2b4d83eedbed	ahu	Sthefani	3	1 copinho médio de 140g do sabor Baunilha	145	2026-04-13 15:44:04.437+00
f6ca24c3-f12c-42a5-a70c-9827704386a6	ahu	Sthefani	1	1 porção de 70g na espátula do sabor Baunilha	85	2026-04-14 14:50:13.115+00
1e2957d0-7e0c-47fb-ac0c-ecde4f686550	ahu	Sthefani	2	1 copinho pequeno de 120g do sabor Baunilha	123	2026-04-14 14:50:13.115+00
d1c8518f-cef7-48ea-b12f-41635596a225	ahu	Sthefani	3	1 copinho médio de 140g do sabor Baunilha	152	2026-04-14 14:50:13.115+00
6e14e943-de29-4697-9a67-2048b37b90a2	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	71	2026-04-15 14:46:04.204+00
50096f0c-b87e-4497-9b1d-5c9e487b122a	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	137	2026-04-15 14:46:04.204+00
a93c7927-254c-41ba-a3da-8a1ab3daf482	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	143	2026-04-15 14:46:04.204+00
a173b755-912c-4df6-9ce9-203fc9fb657a	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	70	2026-04-15 14:51:17.3+00
cfeeb5e0-a2bc-40ed-9215-1146f40acc27	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	122	2026-04-15 14:51:17.3+00
2ede3d7d-b95a-4f9f-a734-40fc0536ed1f	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	138	2026-04-15 14:51:17.3+00
9f3c883e-bbbf-43b9-9ebb-51236c224845	ahu	Sthefani	1	1 porção de 70g na espátula do sabor Baunilha	75	2026-04-16 14:44:50.79+00
88d53cc8-f7ac-4db9-9eb7-9c3acfc8644b	ahu	Sthefani	2	1 copinho pequeno de 120g do sabor Baunilha	121	2026-04-16 14:44:50.79+00
4f9106d6-f687-48df-9a17-f93b48a50969	ahu	Sthefani	3	1 copinho médio de 140g do sabor Baunilha	143	2026-04-16 14:44:50.79+00
34d321e6-11cc-4550-9cf5-fc7ffc4ff269	ahu	Endryw	1	1 porção de 70g na espátula do sabor Baunilha	82	2026-04-17 14:52:57.987+00
d66f93cf-2929-487c-b85a-9cf95553a4aa	ahu	Endryw	2	1 copinho pequeno de 120g do sabor Baunilha	123	2026-04-17 14:52:57.987+00
cadd0e6f-0149-490a-bde8-42067d75bcfc	ahu	Endryw	3	1 copinho médio de 140g do sabor Baunilha	164	2026-04-17 14:52:57.987+00
83369f49-10aa-4f06-8cba-e6862ef6e071	ahu	Sthefani	1	1 porção de 70g na espátula do sabor Baunilha	73	2026-04-17 14:54:05.338+00
02da0d48-e548-4500-b791-f80ecd103c11	ahu	Sthefani	2	1 copinho pequeno de 120g do sabor Baunilha	121	2026-04-17 14:54:05.338+00
634c1b46-ac65-40ed-9025-61b83475cbbc	ahu	Sthefani	3	1 copinho médio de 140g do sabor Baunilha	153	2026-04-17 14:54:05.338+00
a66f3dd5-8d77-440a-ac42-5998a7e1e02e	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	64	2026-04-17 15:07:18.639+00
fad240e4-0e23-406b-b4a9-64a0098d0e1d	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	134	2026-04-17 15:07:18.639+00
24b10f80-9564-443d-a239-e63d3386f6e7	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	143	2026-04-17 15:07:18.639+00
b13404dc-04a1-48b4-8da7-a354d273f554	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	65	2026-04-20 15:08:05.237+00
0824a40b-7b6a-44ad-a437-07037c0436ef	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	127	2026-04-20 15:08:05.237+00
a8b3bb5d-ae01-40da-83fa-c6cbddac8869	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	143	2026-04-20 15:08:05.237+00
4deb78ea-d9d6-4a88-ab13-aaac715fc99b	ahu	Sthefani	1	1 porção de 70g na espátula do sabor Baunilha	75	2026-04-20 15:08:22.639+00
e2ddb833-b8c7-4dc1-9aa9-54a923b279ac	ahu	Sthefani	2	1 copinho pequeno de 120g do sabor Baunilha	126	2026-04-20 15:08:22.639+00
628a428c-54c2-437d-8797-cb437f294a20	ahu	Sthefani	3	1 copinho médio de 140g do sabor Baunilha	146	2026-04-20 15:08:22.639+00
087e2292-957a-4ce0-9ebd-cf27730ac2ed	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	72	2026-04-20 15:11:17.148+00
7a7e2692-cb82-4242-a27a-9f1928852cd4	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	120	2026-04-20 15:11:17.148+00
fb00c0f5-636e-46fc-8d8d-0e1e59e0418d	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	170	2026-04-20 15:11:17.148+00
ba245c88-4f3f-4938-afb6-f2d4fae313ea	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	74	2026-04-22 15:41:19.185+00
08cc107c-41c9-44b0-9211-9956edc9923b	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	126	2026-04-22 15:41:19.185+00
460770a8-0dc2-4f0b-876b-6ca7e27160ec	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	144	2026-04-22 15:41:19.185+00
3a1adc02-21c9-4343-af92-882890bb55e4	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	74	2026-04-22 15:52:30.76+00
70c8e14a-fa4b-4874-b249-1d614868d0f7	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	118	2026-04-22 15:52:30.76+00
3a0d4f6a-20dd-4035-9322-dabce69b0665	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	150	2026-04-22 15:52:30.76+00
53416c22-0f06-432e-a5db-98ee91e03ce8	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	65	2026-04-24 15:52:47.58+00
7eef04bb-4ba2-4664-acab-f90db3458dc8	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	114	2026-04-24 15:52:47.58+00
f7da195d-e486-4df4-b4d3-312cd0a5ab78	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	150	2026-04-24 15:52:47.58+00
e3f7b041-9cac-4c03-a5bb-cf12505dc521	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	75	2026-04-27 15:04:21.072+00
23068557-8389-46a2-ae0c-611d36127ba4	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	117	2026-04-27 15:04:21.072+00
f4375d48-15b9-4c11-92a1-b61bae3f8484	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	144	2026-04-27 15:04:21.072+00
34799903-c475-49ed-b4b2-aa32e1f8bc86	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	76	2026-04-27 15:08:52.97+00
bf39015f-ae0a-48e5-a553-0b5c0063fac9	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	123	2026-04-27 15:08:52.97+00
8067203c-0338-4427-b73a-f0369c589cab	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	167	2026-04-27 15:08:52.97+00
a6dbcbb7-2408-4a61-be1c-c50047db2cc7	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	78	2026-04-29 15:34:36.381+00
f15b01a3-f629-4ddc-833b-3f16cf4eb04f	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	131	2026-04-29 15:34:36.381+00
28c2f30e-dede-449b-9d42-d5d4e3f1d004	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	146	2026-04-29 15:34:36.381+00
94433335-4e1b-40d6-b3fe-31cd8a1d4379	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	87	2026-05-01 15:13:04.896+00
3e795e6e-6dd3-4b04-942f-bf207481d3b3	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	116	2026-05-01 15:13:04.896+00
4200e8f5-04f0-4af7-b821-85c82951547d	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	135	2026-05-01 15:13:04.896+00
fa84c4d9-4fb2-4019-9ff0-6633d3251faa	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	73	2026-05-04 14:52:41.333+00
6992531d-5c3d-470a-a667-f69197e74443	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	122	2026-05-04 14:52:41.333+00
019f39f9-337e-4493-9812-8fabb178736c	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	155	2026-05-04 14:52:41.333+00
3ebd8896-1fef-442e-b0d4-49469008f283	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	79	2026-05-04 14:54:32.804+00
fe11f193-a845-4593-9403-9fe259fac709	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	118	2026-05-04 14:54:32.804+00
c650caa0-a71e-44d6-b6ef-30b5eb3b4c53	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	149	2026-05-04 14:54:32.804+00
bad064dc-4ad7-4dbc-8941-c740588f1595	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	70	2026-05-06 15:00:10.958+00
00d7e6db-6c53-4afc-b92f-4d2c8062a2e7	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	113	2026-05-06 15:00:10.958+00
e861cb68-6164-46f3-b80f-4dda6e40bdd4	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	168	2026-05-06 15:00:10.958+00
999c3649-df1a-407d-a599-83eb0ddc341f	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	80	2026-05-06 15:03:42.129+00
19f92bf0-91a1-4431-8e8d-58ec2246df8e	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	124	2026-05-06 15:03:42.129+00
0ee855fd-c4b6-4a43-a77e-732b8dbbb9c3	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	150	2026-05-06 15:03:42.129+00
f10c93d6-d235-4b38-8679-8764c4f94421	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	86	2026-05-08 15:08:49.597+00
f4f92843-a99b-4f33-a725-64cab5c65524	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	125	2026-05-08 15:08:49.597+00
cd0053ab-bc7f-40e3-854b-230e5305ba9a	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	153	2026-05-08 15:08:49.597+00
bf0a81e5-1200-4ec8-a491-9bc2c76027c7	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	76	2026-05-11 15:02:59.816+00
1e7df0e2-4512-46ad-810d-7810914789fe	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	134	2026-05-11 15:02:59.816+00
9d773844-e813-4d13-8bd6-11a7e4d992df	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	160	2026-05-11 15:02:59.816+00
236681dd-079c-4a17-a935-6b1000c77f14	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	71	2026-05-11 15:07:01.295+00
4c08ce97-a757-4864-82fe-f64fc48a019c	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	118	2026-05-11 15:07:01.295+00
5ce60666-6cad-4d9b-93d6-5f14c911d9f5	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	157	2026-05-11 15:07:01.295+00
cdacbfe4-d93b-4e48-9b18-59a0407af83c	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	69	2026-05-13 14:51:23.955+00
8096c664-44da-433a-9ced-36fff63d33cf	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	117	2026-05-13 14:51:23.955+00
022e034d-75bc-4358-a695-ce14e5a512da	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	137	2026-05-13 14:51:23.955+00
26cea047-f354-460d-8c50-3e774db656eb	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	71	2026-05-13 14:53:27.558+00
56bc8053-cdcb-47a8-9778-d27e7e85b95d	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	127	2026-05-13 14:53:27.558+00
e66ef013-6aae-4fe4-82a7-6bae0f44bd5b	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	166	2026-05-13 14:53:27.558+00
7a76d646-846f-48a9-a3e9-15f997c9bbdd	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	79	2026-05-15 15:00:45.108+00
762364bc-adc5-4107-aa76-0ab1447b7609	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	135	2026-05-15 15:00:45.108+00
75f9cec6-2df0-423c-b81c-0d57d8c21438	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	148	2026-05-15 15:00:45.108+00
5cf64920-6f4c-451e-9ec3-126cd4c6b545	ahu	Sthefani	1	1 porção de 70g na espátula do sabor Baunilha	87	2026-05-16 14:55:15.187+00
6dea1d19-582d-4007-8d2d-d0350c45100b	ahu	Sthefani	2	1 copinho pequeno de 120g do sabor Baunilha	126	2026-05-16 14:55:15.187+00
a033cc92-bdb6-4c3b-9055-4378f7102356	ahu	Sthefani	3	1 copinho médio de 140g do sabor Baunilha	154	2026-05-16 14:55:15.187+00
a94a96e3-8f28-44e9-91cc-c4501e4e4ba1	ahu	Endryw	1	1 porção de 70g na espátula do sabor Baunilha	98	2026-05-16 14:57:49.949+00
0c06bfb0-f9eb-48cf-82ab-92473bb5a129	ahu	Endryw	2	1 copinho pequeno de 120g do sabor Baunilha	125	2026-05-16 14:57:49.949+00
85597166-8ed1-46d1-85a4-222e848c7d03	ahu	Endryw	3	1 copinho médio de 140g do sabor Baunilha	166	2026-05-16 14:57:49.949+00
ef4102ba-9e63-418f-a215-21bcaeb83175	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	66	2026-05-18 14:57:07.633+00
588eb917-aae0-4bf1-9bdf-f8ffc87cddbf	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	116	2026-05-18 14:57:07.633+00
c81af352-0068-49ce-99bd-7eebc56c2f00	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	150	2026-05-18 14:57:07.633+00
6bdf2bef-e362-4e55-94bc-3be63fb07294	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	86	2026-05-18 15:01:52.4+00
d4c58cfd-e854-445e-950a-0cf9fd2234b3	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	117	2026-05-18 15:01:52.4+00
5203adb5-6570-4977-af07-1d2b59f9f0a8	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	151	2026-05-18 15:01:52.4+00
670bb83f-2da5-42a5-9c82-78c5f3270140	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	93	2026-05-21 14:55:26.503+00
fb4eaa46-785f-4ec5-80ff-24f9fd448752	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	118	2026-05-21 14:55:26.503+00
de1ec32b-0156-4a3e-9070-744e2d546255	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	134	2026-05-21 14:55:26.503+00
b9d77f64-8a18-473b-8a0e-bd269a6e88f6	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	80	2026-05-21 14:58:15.897+00
12ba2e77-4e0b-42d5-9ec0-2794e38a5f02	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	126	2026-05-21 14:58:15.897+00
17a1529c-d0ae-42e4-8f1a-6871d50bfb53	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	197	2026-05-21 14:58:15.897+00
84f2983d-64a9-48ce-95da-6bcab2f73620	ahu	Endryw	1	1 porção de 70g na espátula do sabor Baunilha	82	2026-05-23 14:41:03.9+00
cd47502b-4513-440d-8abd-fa1871942b5e	ahu	Endryw	2	1 copinho pequeno de 120g do sabor Baunilha	122	2026-05-23 14:41:03.9+00
367e3076-b137-44ba-8d30-d4dfc64f3b67	ahu	Endryw	3	1 copinho médio de 140g do sabor Baunilha	141	2026-05-23 14:41:03.9+00
7ca1d1be-843a-48ab-8c28-819a4331c0a0	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	68	2026-05-23 14:46:43.951+00
a5005f3e-254e-4221-84e3-a4013f6286b0	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	123	2026-05-23 14:46:43.951+00
e2e912aa-5466-4d93-9dc1-4a5e713127d6	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	147	2026-05-23 14:46:43.951+00
865ae7d0-4261-4745-bda7-d3dac8620875	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	84	2026-05-23 14:49:17.973+00
dcbe76a3-a2bd-4048-915a-710c64eb828a	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	133	2026-05-23 14:49:17.973+00
822d7b52-f1b8-49cb-8c5f-3a197b890109	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	141	2026-05-23 14:49:17.973+00
5f37d877-0acd-40e4-a0d0-c0f261f0dbfa	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	62	2026-05-24 15:02:32.381+00
0bdccfc2-c3a1-41bf-8ad4-d0998ab5775c	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	120	2026-05-24 15:02:32.381+00
03009f53-56bc-4df2-8798-b71bda3583ab	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	162	2026-05-24 15:02:32.381+00
f8825e56-77d5-417b-b6a5-3f02d14a5dc1	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	69	2026-05-24 15:06:21.062+00
2f359412-00ba-411f-815e-76bd13699482	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	118	2026-05-24 15:06:21.062+00
de6bc87f-fab2-497a-8155-2048ccad881f	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	134	2026-05-24 15:06:21.062+00
e218e44d-fbaa-498d-adb5-6a64921a8222	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	78	2026-05-28 14:49:55.061+00
87ab6dbc-0d81-45b9-a102-ac3036e6c4e1	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	125	2026-05-28 14:49:55.061+00
da6da625-c3b7-465f-bcc5-17d594ef9be8	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	159	2026-05-28 14:49:55.061+00
7f9e8540-fa08-482c-a535-3f65e7799de3	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	76	2026-05-28 14:56:23.052+00
df177ba9-1565-46df-8a6b-c1d1855c1680	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	126	2026-05-28 14:56:23.052+00
aae4e9c2-1674-4ee8-bb2e-701b90653c4e	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	155	2026-05-28 14:56:23.052+00
14c9cbe2-3046-447a-9472-0a6956e6608c	ahu	Sthefani	1	1 porção de 70g na espátula do sabor Baunilha	84	2026-05-30 14:56:50.027+00
125c7744-66c5-4ac9-9728-cf4fceb65f3f	ahu	Sthefani	2	1 copinho pequeno de 120g do sabor Baunilha	127	2026-05-30 14:56:50.027+00
8acf845a-0892-4f7f-96c9-085b09647c18	ahu	Sthefani	3	1 copinho médio de 140g do sabor Baunilha	160	2026-05-30 14:56:50.027+00
ac96c2c6-4cb3-4783-868c-818c59e7625e	Alto XV	Amanda	1	1 porção de 70g na espátula do sabor Baunilha	79	2026-05-30 15:00:25.417+00
3a12cf0f-27cc-4c7a-bd8b-f37e002e5e71	Alto XV	Amanda	2	1 copinho pequeno de 120g do sabor Baunilha	114	2026-05-30 15:00:25.417+00
118cbcdd-5f4f-4cc1-806c-e8811a41a492	Alto XV	Amanda	3	1 copinho médio de 140g do sabor Baunilha	136	2026-05-30 15:00:25.417+00
34c66bc0-e91a-47ea-9d50-dcb0e5bc6237	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	67	2026-05-30 15:04:16.786+00
a7640027-8ebe-4ce0-9e99-36799b3a08e6	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	121	2026-05-30 15:04:16.786+00
2a24a40d-81fc-4526-903c-9f8d18b6150b	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	156	2026-05-30 15:04:16.786+00
3492ec2e-57b2-4cb1-8f6e-b362542326ae	Alto XV	Cassia	1	1 porção de 70g na espátula do sabor Baunilha	62	2026-05-31 15:12:56.562+00
96743671-03ca-4985-b73f-88b69d1bc48c	Alto XV	Cassia	2	1 copinho pequeno de 120g do sabor Baunilha	123	2026-05-31 15:12:56.562+00
2ad199bd-eebe-42ae-87ee-adeab832fe92	Alto XV	Cassia	3	1 copinho médio de 140g do sabor Baunilha	153	2026-05-31 15:12:56.562+00
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."profiles" ("id", "email", "name", "updated_at", "short_id", "is_admin", "controlar_frequencia", "folgas_fixas", "ativo", "data_registro", "passagens_urbs", "passagens_metrocard") FROM stdin;
054e1fc1-7d77-4ae0-addb-13e440f53d6b	cassiafernanda344@gmail.com	Cassia	2026-05-29 17:49:42.498+00	6736	f	t	5	t	2026-02-12	2	0
c24dd627-7a1e-407e-9fe0-eefe4d5320c7	endrywgabrielx@gmail.com	Endryw	2026-05-29 17:52:28.262+00	9845	f	t	1	t	2026-01-16	1	1
1d621888-613a-4a15-b796-3c4120f51af2	mh.escritoriocarmella@gmail.com	Talita	2026-05-29 17:52:59.078+00	2836	f	t	6,0	t	2025-11-13	2	0
3e43c2e5-3604-48ad-807a-bfa38ebdbfff	sthefani.alves.def@gmail.com	Sthefani	2026-05-29 17:53:23.527+00	2982	f	t	3	t	2025-05-05	1	1
cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3	teste@gmail.com	teste	2026-05-30 02:51:18.12+00		f	f	4	t	2026-05-20	2	0
b5668aed-dbb4-4d19-918e-c4e62e308487	mh.loja.ahu@gmail.com	Loja Ahu	2026-06-01 00:51:42.697+00		f	f		t	\N	0	0
d68a59d3-2331-4ada-a377-60659501c047	mh.loja.altoxv@gmail.com	Loja Alto XV	2026-06-01 00:52:00.005+00		f	f		t	\N	0	0
35cae5eb-f980-4be0-9998-ac8173ed2afc	henocera@gmail.com	Henrique	2026-05-26 03:41:09.471+00	2703	t	f		t	\N	0	0
16ddd940-9f73-4313-ba08-9ee96735181c	amandacorte053@gmail.com	Amanda	2026-05-26 22:03:44.892+00	6943	f	t	2	t	2026-04-01	2	0
d956fdab-0d1c-463c-9cfc-63f42d3645a5	marina_nocera@yahoo.com.br	Marina	2026-05-26 11:28:31.437+00	1727	f	f		t	\N	0	0
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."audit_logs" ("id", "tabela_afetada", "acao", "dados_antigos", "dados_novos", "usuario_id", "data_hora") FROM stdin;
5cd52b0f-4125-49bd-99b9-c442d9a8dd32	frequencia	INSERT	\N	{"id": 190, "date": "2026-03-01", "status": "Falta Não Justificada", "observacao": null, "updated_at": "2026-05-26T21:57:32.954+00:00", "employee_id": "16ddd940-9f73-4313-ba08-9ee96735181c", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-26 21:57:33.197119+00
5697e9d4-6cef-4dbb-8b47-66060f2d8826	Checklist	INSERT	\N	{"id": 1928, "panos": "2", "store": "ahu", "massas": "7 [7 (venc. 30/05/2026)]", "person": "Sthefani", "brownies": "6 [6 (venc. 17/06/2026)]", "checklist": "Checklist de Fechamento", "created_at": "2026-05-26T22:01:11.771006+00:00", "money_data": null}	\N	2026-05-26 22:01:11.771006+00
fba8cb5d-a283-419c-ad41-bbad3e5a4cf5	Vales	INSERT	\N	{"id": 1280, "Item": "Waffle de Liege", "Nome": "Endryw", "Unidade": "Ahu", "created_at": "2026-05-26T22:01:56.200945+00:00"}	\N	2026-05-26 22:01:56.200945+00
cd0f68dc-f514-4bec-bacf-91c0c3406af6	Vales	INSERT	\N	{"id": 1281, "Item": "Nutella - 40gr", "Nome": "Endryw", "Unidade": "Ahu", "created_at": "2026-05-26T22:02:10.104609+00:00"}	\N	2026-05-26 22:02:10.104609+00
2f11d166-d35a-4171-b024-22799137dfb1	Vales	INSERT	\N	{"id": 1282, "Item": "Nutella - 40gr", "Nome": "Endryw", "Unidade": "Ahu", "created_at": "2026-05-26T22:02:21.482463+00:00"}	\N	2026-05-26 22:02:21.482463+00
df7ece96-16e6-47d3-bc7f-9ba75ee144e3	profiles	UPDATE	{"id": "16ddd940-9f73-4313-ba08-9ee96735181c", "name": "Amanda", "ativo": true, "email": "amandacorte053@gmail.com", "is_admin": false, "short_id": "6943", "updated_at": "2026-05-26T12:38:39.556+00:00", "folgas_fixas": "2", "data_registro": null, "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	{"id": "16ddd940-9f73-4313-ba08-9ee96735181c", "name": "Amanda", "ativo": true, "email": "amandacorte053@gmail.com", "is_admin": false, "short_id": "6943", "updated_at": "2026-05-26T22:03:44.892+00:00", "folgas_fixas": "2", "data_registro": "2026-04-01", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-26 22:03:45.103599+00
f2e8859f-ea78-4513-8fd4-dd9e867a273e	profiles	UPDATE	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "joao", "ativo": false, "email": "joao@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-26T13:10:20.03+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "joao", "ativo": true, "email": "joao@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-26T22:06:45.138+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-26 22:06:45.336469+00
4dd0c971-7547-47a7-a4c5-5cbf12590d67	Checklist	INSERT	\N	{"id": 1929, "panos": "5", "store": "altoxv", "massas": "2 [2 (venc. 30/05/2026)]", "person": "Cassia", "brownies": "6 [6 (venc. 17/06/2026)]", "checklist": "Checklist de Fechamento", "created_at": "2026-05-26T22:07:12.705868+00:00", "money_data": null}	\N	2026-05-26 22:07:12.705868+00
ff9adccc-699e-49c1-952b-b0dd8cbec0df	profiles	UPDATE	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "joao", "ativo": true, "email": "joao@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-26T22:06:45.138+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "joao", "ativo": false, "email": "joao@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-26T22:07:16.593+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-26 22:07:16.769704+00
288496d6-4692-43e5-9028-7ede3e47a495	frequencia	INSERT	\N	{"id": 191, "date": "2026-05-01", "status": "Falta Não Justificada", "observacao": null, "updated_at": "2026-05-26T22:07:43.899+00:00", "employee_id": "16ddd940-9f73-4313-ba08-9ee96735181c", "observacao_at": null, "observacao_by": null}	cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3	2026-05-26 22:07:44.181864+00
8dd32560-12e5-4c70-bf83-ca920cfc1ef3	frequencia	UPDATE	{"id": 191, "date": "2026-05-01", "status": "Falta Não Justificada", "observacao": null, "updated_at": "2026-05-26T22:07:43.899+00:00", "employee_id": "16ddd940-9f73-4313-ba08-9ee96735181c", "observacao_at": null, "observacao_by": null}	{"id": 191, "date": "2026-05-01", "status": "Trabalhado", "observacao": null, "updated_at": "2026-05-26T22:07:50.442+00:00", "employee_id": "16ddd940-9f73-4313-ba08-9ee96735181c", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-26 22:07:50.691261+00
51eb07dd-593d-4fab-a4a6-4831cf528e15	historico_colaborador	INSERT	\N	{"id": 10, "date": "2026-05-27", "type": "Informação", "title": "teste", "created_at": "2026-05-27T02:25:56.424843+00:00", "created_by": "35cae5eb-f980-4be0-9998-ac8173ed2afc", "description": "teste", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff"}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-27 02:25:56.424843+00
1c66c395-0bb0-42da-918d-5502fa90ce7a	historico_colaborador	INSERT	\N	{"id": 11, "date": "2026-05-27", "type": "Observação", "title": "teste", "created_at": "2026-05-27T02:26:02.54079+00:00", "created_by": "35cae5eb-f980-4be0-9998-ac8173ed2afc", "description": "teste", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff"}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-27 02:26:02.54079+00
56defec8-2fd8-4ed3-b9b7-b80ecd84c8e2	historico_colaborador	INSERT	\N	{"id": 12, "date": "2026-05-27", "type": "Elogio", "title": "tese", "created_at": "2026-05-27T02:26:10.866907+00:00", "created_by": "35cae5eb-f980-4be0-9998-ac8173ed2afc", "description": "teste", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff"}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-27 02:26:10.866907+00
a9cb3b0a-c50b-422a-b8eb-0c6f1570f1f0	historico_colaborador	INSERT	\N	{"id": 13, "date": "2026-05-27", "type": "Outro", "title": "teste", "created_at": "2026-05-27T02:26:14.941467+00:00", "created_by": "35cae5eb-f980-4be0-9998-ac8173ed2afc", "description": "teste", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff"}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-27 02:26:14.941467+00
a6f4564b-3545-469d-a115-64b235d1836e	historico_colaborador	DELETE	{"id": 13, "date": "2026-05-27", "type": "Outro", "title": "teste", "created_at": "2026-05-27T02:26:14.941467+00:00", "created_by": "35cae5eb-f980-4be0-9998-ac8173ed2afc", "description": "teste", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff"}	\N	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-27 02:26:22.055441+00
c5ed1d55-b36b-42fd-a5c0-740ba2ee542a	historico_colaborador	DELETE	{"id": 12, "date": "2026-05-27", "type": "Elogio", "title": "tese", "created_at": "2026-05-27T02:26:10.866907+00:00", "created_by": "35cae5eb-f980-4be0-9998-ac8173ed2afc", "description": "teste", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff"}	\N	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-27 02:26:24.833324+00
b7bfa578-92a1-4145-a950-2125a9af286b	historico_colaborador	DELETE	{"id": 11, "date": "2026-05-27", "type": "Observação", "title": "teste", "created_at": "2026-05-27T02:26:02.54079+00:00", "created_by": "35cae5eb-f980-4be0-9998-ac8173ed2afc", "description": "teste", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff"}	\N	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-27 02:26:27.316229+00
a1fe825a-a9dc-47b1-9bd4-5b388cf9a629	historico_colaborador	DELETE	{"id": 10, "date": "2026-05-27", "type": "Informação", "title": "teste", "created_at": "2026-05-27T02:25:56.424843+00:00", "created_by": "35cae5eb-f980-4be0-9998-ac8173ed2afc", "description": "teste", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff"}	\N	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-27 02:26:28.749226+00
91b8a7ef-8a26-4be9-a9a2-72a96ebdd05c	profiles	UPDATE	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "joao", "ativo": false, "email": "joao@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-26T22:07:16.593+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "joao", "ativo": true, "email": "joao@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-27T02:56:53.151+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-27 02:56:53.484311+00
8dd86c47-bf3c-4f47-8076-2b9a340e3d87	historico_colaborador	INSERT	\N	{"id": 14, "date": "2026-04-01", "type": "Informação", "title": "Aumento de Salário", "created_at": "2026-05-27T02:58:33.938002+00:00", "created_by": "35cae5eb-f980-4be0-9998-ac8173ed2afc", "description": "Aumento de Salário", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff"}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-27 02:58:33.938002+00
e5deafd0-7791-4a3a-bb08-1a072d50b8ad	profiles	UPDATE	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "joao", "ativo": true, "email": "joao@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-27T02:56:53.151+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "joao", "ativo": false, "email": "joao@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-27T03:22:20.781+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-27 03:22:21.094485+00
aa1cb61a-6b8d-4b15-8b65-4b926e097d1c	Vouchers	INSERT	\N	{"id": 18, "value": "1 Affogato Grátis", "active": true, "created_at": "2026-05-27T03:26:03.892888+00:00", "voucher_id": "Raffael - 2805", "date_consumed": null, "store_consumed": null, "person_consumed": null}	\N	2026-05-27 03:26:03.892888+00
46c6ccce-99b4-470e-bd0e-31f3b6eb96df	Vouchers	UPDATE	{"id": 18, "value": "1 Affogato Grátis", "active": true, "created_at": "2026-05-27T03:26:03.892888+00:00", "voucher_id": "Raffael - 2805", "date_consumed": null, "store_consumed": null, "person_consumed": null}	{"id": 18, "value": "1 Affogato Grátis", "active": true, "created_at": "2026-05-27T03:26:03.892888+00:00", "voucher_id": "Raffael - 2705", "date_consumed": null, "store_consumed": null, "person_consumed": null}	\N	2026-05-27 03:26:34.251345+00
dd9f4d7c-d7d7-4414-906e-866458a97c10	Vouchers	UPDATE	{"id": 17, "value": "1 Gelato Médio", "active": true, "created_at": "2025-12-16T20:41:04.067742+00:00", "voucher_id": "FAT1612", "date_consumed": null, "store_consumed": null, "person_consumed": null}	{"id": 17, "value": "1 Gelato Médio", "active": false, "created_at": "2025-12-16T20:41:04.067742+00:00", "voucher_id": "FAT1612", "date_consumed": "2026-05-27T03:26:49.557", "store_consumed": "Ahu", "person_consumed": "Henrique"}	\N	2026-05-27 03:26:51.142201+00
b0b8dfa0-44bb-42f1-9226-0bc70e5fe792	Vouchers	UPDATE	{"id": 15, "value": "1 Gelato Médio", "active": true, "created_at": "2025-12-16T20:40:42.550869+00:00", "voucher_id": "KEL1612", "date_consumed": null, "store_consumed": null, "person_consumed": null}	{"id": 15, "value": "1 Gelato Médio", "active": false, "created_at": "2025-12-16T20:40:42.550869+00:00", "voucher_id": "KEL1612", "date_consumed": "2026-05-27T03:26:51.689", "store_consumed": "Ahu", "person_consumed": "Henrique"}	\N	2026-05-27 03:26:54.118397+00
24eb3d10-dd1f-4efc-87f4-4a45ef4e0e3f	Vouchers	UPDATE	{"id": 14, "value": "1 Gelato Médio", "active": true, "created_at": "2025-12-16T20:40:21.633879+00:00", "voucher_id": "TAN1612", "date_consumed": null, "store_consumed": null, "person_consumed": null}	{"id": 14, "value": "1 Gelato Médio", "active": false, "created_at": "2025-12-16T20:40:21.633879+00:00", "voucher_id": "TAN1612", "date_consumed": "2026-05-27T03:26:54.529", "store_consumed": "Ahu", "person_consumed": "Henrique"}	\N	2026-05-27 03:26:55.796183+00
b7158685-4cec-4a7b-a591-3b21866b2ffb	Vouchers	UPDATE	{"id": 18, "value": "1 Affogato Grátis", "active": true, "created_at": "2026-05-27T03:26:03.892888+00:00", "voucher_id": "Raffael - 2705", "date_consumed": null, "store_consumed": null, "person_consumed": null}	{"id": 18, "value": "1 Affogato Grátis", "active": true, "created_at": "2026-05-27T03:26:03.892888+00:00", "voucher_id": "RFL2705", "date_consumed": null, "store_consumed": null, "person_consumed": null}	\N	2026-05-27 12:44:05.661238+00
f22e50ad-8e9d-424f-a9cb-d40d3c7143bf	frequencia	INSERT	\N	{"id": 193, "date": "2026-05-27", "status": "Folga Compensatória", "observacao": null, "updated_at": "2026-05-27T14:38:19.527+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-27 14:38:21.385012+00
e00dad8e-9105-4026-b8ac-d830c9f58f77	frequencia	UPDATE	{"id": 193, "date": "2026-05-27", "status": "Folga Compensatória", "observacao": null, "updated_at": "2026-05-27T14:38:19.527+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	{"id": 193, "date": "2026-05-27", "status": "Atestado", "observacao": null, "updated_at": "2026-05-27T14:38:29.664+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-27 14:38:31.488205+00
690da9fb-7730-4e97-9070-b52642979be2	frequencia	UPDATE	{"id": 193, "date": "2026-05-27", "status": "Atestado", "observacao": null, "updated_at": "2026-05-27T14:38:29.664+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	{"id": 193, "date": "2026-05-27", "status": "Falta Não Justificada", "observacao": null, "updated_at": "2026-05-27T14:39:21.59+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-27 14:39:23.45019+00
dbd8a053-8d1a-4f65-838a-10c6fc97b972	frequencia	INSERT	\N	{"id": 196, "date": "2026-05-27", "status": "Atestado", "observacao": null, "updated_at": "2026-05-27T14:40:44.667+00:00", "employee_id": "054e1fc1-7d77-4ae0-addb-13e440f53d6b", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-27 14:40:46.513287+00
82a0691b-eeb5-4a48-a792-4c52cd804b3a	frequencia	INSERT	\N	{"id": 197, "date": "2026-05-27", "status": "Folga Compensatória", "observacao": null, "updated_at": "2026-05-27T14:40:49.406+00:00", "employee_id": "16ddd940-9f73-4313-ba08-9ee96735181c", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-27 14:40:51.228661+00
75a3d487-ba1c-4816-901e-f5e01d49b9ee	frequencia	UPDATE	{"id": 193, "date": "2026-05-27", "status": "Falta Não Justificada", "observacao": null, "updated_at": "2026-05-27T14:39:21.59+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	{"id": 193, "date": "2026-05-27", "status": "Trabalhado", "observacao": null, "updated_at": "2026-05-27T14:41:03.845+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-27 14:41:05.658928+00
96645cfc-658d-453e-bc90-31a756eea04a	frequencia	UPDATE	{"id": 196, "date": "2026-05-27", "status": "Atestado", "observacao": null, "updated_at": "2026-05-27T14:40:44.667+00:00", "employee_id": "054e1fc1-7d77-4ae0-addb-13e440f53d6b", "observacao_at": null, "observacao_by": null}	{"id": 196, "date": "2026-05-27", "status": "Trabalhado", "observacao": null, "updated_at": "2026-05-27T14:41:04.725+00:00", "employee_id": "054e1fc1-7d77-4ae0-addb-13e440f53d6b", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-27 14:41:06.530696+00
bafa510f-db6c-4264-9f3f-7f7caab27723	frequencia	UPDATE	{"id": 197, "date": "2026-05-27", "status": "Folga Compensatória", "observacao": null, "updated_at": "2026-05-27T14:40:49.406+00:00", "employee_id": "16ddd940-9f73-4313-ba08-9ee96735181c", "observacao_at": null, "observacao_by": null}	{"id": 197, "date": "2026-05-27", "status": "Trabalhado", "observacao": null, "updated_at": "2026-05-27T14:41:05.621+00:00", "employee_id": "16ddd940-9f73-4313-ba08-9ee96735181c", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-27 14:41:07.428859+00
954fe605-1feb-4549-a5d6-2b52e76c611e	Checklist	INSERT	\N	{"id": 1930, "panos": null, "store": "ahu", "massas": null, "person": "Endryw", "brownies": null, "checklist": "Checklist de Abertura", "created_at": "2026-05-27T15:01:41.624301+00:00", "money_data": {"total": 365.15, "denominacoes": {"ten": 10, "two": 2, "five": 15, "fifty": "", "twenty": 4, "hundred": 1, "oneCent": "", "oneReal": 4, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}}	\N	2026-05-27 15:01:41.624301+00
8aaf4cc1-5a20-49ca-8bb4-0e4838673927	Checklist	INSERT	\N	{"id": 1931, "panos": null, "store": "altoxv", "massas": null, "person": "Cassia", "brownies": null, "checklist": "Checklist de Abertura", "created_at": "2026-05-27T15:07:09.640927+00:00", "money_data": {"total": 296.6, "denominacoes": {"ten": 9, "two": 6, "five": 1, "fifty": "", "twenty": 9, "hundred": "", "oneCent": "", "oneReal": 8, "tenCents": 13, "fiveCents": 6, "fiftyCents": "", "twentyFiveCents": ""}}}	\N	2026-05-27 15:07:09.640927+00
1ffb2df5-1f1a-4c41-992a-3d7a782bf106	Vales	INSERT	\N	{"id": 1283, "Item": "Refri, Chá ou Suco", "Nome": "Amanda", "Unidade": "Alto da XV", "created_at": "2026-05-27T15:37:38.264872+00:00"}	\N	2026-05-27 15:37:38.264872+00
d927a893-c176-4619-944d-01d829652bd0	Vales	INSERT	\N	{"id": 1284, "Item": "Brownie", "Nome": "Amanda", "Unidade": "Alto da XV", "created_at": "2026-05-27T15:55:47.402777+00:00"}	\N	2026-05-27 15:55:47.402777+00
ca0118f6-6e76-405d-a3f5-e320934dfab3	Checklist	INSERT	\N	{"id": 1932, "panos": null, "store": "escritorio", "massas": null, "person": "Talita", "brownies": null, "checklist": "Checklist de Fechamento", "created_at": "2026-05-27T16:03:37.868957+00:00", "money_data": null}	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-27 16:03:37.868957+00
a96c9eaf-b360-4e7c-aa9e-b55cba086b35	Vales	INSERT	\N	{"id": 1285, "Item": "Refri, Chá ou Suco", "Nome": "Talita", "Unidade": "Alto da XV", "created_at": "2026-05-27T16:04:00.279055+00:00"}	\N	2026-05-27 16:04:00.279055+00
7f67c161-4735-4e4c-876f-b724619c16f8	Vales	INSERT	\N	{"id": 1286, "Item": "Sanduíche de Parma", "Nome": "Talita", "Unidade": "Alto da XV", "created_at": "2026-05-27T16:04:17.739595+00:00"}	\N	2026-05-27 16:04:17.739595+00
98383ba8-7457-4acf-a1f8-49d93bb6135b	Vales	INSERT	\N	{"id": 1287, "Item": "Refri, Chá ou Suco", "Nome": "Endryw", "Unidade": "Ahu", "created_at": "2026-05-27T17:15:05.413201+00:00"}	\N	2026-05-27 17:15:05.413201+00
0e7d27bc-a640-4cda-9229-19c3546ace3b	Vales	INSERT	\N	{"id": 1288, "Item": "Refri, Chá ou Suco", "Nome": "Cassia", "Unidade": "Alto da XV", "created_at": "2026-05-27T17:27:28.652184+00:00"}	\N	2026-05-27 17:27:28.652184+00
36dcb8aa-cbad-4eda-9a2c-b1c1a4131965	Vales	INSERT	\N	{"id": 1289, "Item": "Refri, Chá ou Suco", "Nome": "Endryw", "Unidade": "Ahu", "created_at": "2026-05-27T19:36:09.896636+00:00"}	\N	2026-05-27 19:36:09.896636+00
28466cb0-47bb-48c8-a89b-33b296faf615	Vales	INSERT	\N	{"id": 1290, "Item": "Refri, Chá ou Suco", "Nome": "Endryw", "Unidade": "Ahu", "created_at": "2026-05-27T20:03:46.557099+00:00"}	\N	2026-05-27 20:03:46.557099+00
e589cbe2-6f28-4f63-90b3-c7384059c850	Checklist	INSERT	\N	{"id": 1933, "panos": "1", "store": "ahu", "massas": "6 [6 (venc. 30/05/2026)]", "person": "Endryw", "brownies": "6 [6 (venc. 17/06/2026)]", "checklist": "Checklist de Fechamento", "created_at": "2026-05-27T22:00:52.386746+00:00", "money_data": null}	\N	2026-05-27 22:00:52.386746+00
1e376288-8fa1-4d82-9e1c-3e269b2f3c94	Checklist	INSERT	\N	{"id": 1934, "panos": "4", "store": "altoxv", "massas": "11 [10 (venc. 04/06/2026), 1 (venc. 30/05/2026)]", "person": "Cassia", "brownies": "5 [5 (venc. 17/06/2026)]", "checklist": "Checklist de Fechamento", "created_at": "2026-05-27T22:02:40.479353+00:00", "money_data": null}	\N	2026-05-27 22:02:40.479353+00
81351548-3c54-4001-b645-75862a2b145d	profiles	UPDATE	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "joao", "ativo": false, "email": "joao@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-27T03:22:20.781+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "joao", "ativo": true, "email": "joao@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-28T11:54:06.017+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 11:54:06.756184+00
fff2027b-7fc0-4f9f-80d7-99d6abc3acca	profiles	UPDATE	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "joao", "ativo": true, "email": "joao@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-28T11:54:06.017+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "joao", "ativo": false, "email": "joao@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-28T12:06:09.094+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 12:06:09.81759+00
a03acccc-64f2-4e93-8503-cc7540c9f9d1	frequencia	UPDATE	{"id": 193, "date": "2026-05-27", "status": "Trabalhado", "observacao": null, "updated_at": "2026-05-27T14:41:03.845+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	{"id": 193, "date": "2026-05-27", "status": "Atraso", "observacao": null, "updated_at": "2026-05-28T12:54:58.857+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-28 12:54:57.870853+00
a0047f44-feb6-48ef-8fb6-d3e5ebfefc51	frequencia	UPDATE	{"id": 196, "date": "2026-05-27", "status": "Trabalhado", "observacao": null, "updated_at": "2026-05-27T14:41:04.725+00:00", "employee_id": "054e1fc1-7d77-4ae0-addb-13e440f53d6b", "observacao_at": null, "observacao_by": null}	{"id": 196, "date": "2026-05-27", "status": "Atraso", "observacao": null, "updated_at": "2026-05-28T12:55:04.26+00:00", "employee_id": "054e1fc1-7d77-4ae0-addb-13e440f53d6b", "observacao_at": null, "observacao_by": null}	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-28 12:55:03.2495+00
5ab04ed2-304b-4af2-923c-385c56515f3c	profiles	UPDATE	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "joao", "ativo": false, "email": "joao@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-28T12:06:09.094+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "joao", "ativo": true, "email": "joao@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-28T13:00:56.376+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 13:00:57.211098+00
8b1639d5-11f2-4d76-9711-1b634a3bca68	profiles	UPDATE	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "joao", "ativo": true, "email": "joao@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-28T13:00:56.376+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "joao", "ativo": false, "email": "joao@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-28T13:01:01.999+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 13:01:02.78403+00
59054e83-5a42-4101-bc2f-22df281f3134	Checklist	INSERT	\N	{"id": 1935, "panos": null, "store": "altoxv", "massas": null, "person": "Cassia", "brownies": null, "checklist": "Checklist de Abertura", "created_at": "2026-05-28T14:56:33.320829+00:00", "money_data": {"total": 436.5, "denominacoes": {"ten": 8, "two": 5, "five": 0, "fifty": 0, "twenty": 12, "hundred": 1, "oneCent": "", "oneReal": 5, "tenCents": 12, "fiveCents": 6, "fiftyCents": "", "twentyFiveCents": ""}}}	\N	2026-05-28 14:56:33.320829+00
60fdfaee-3465-47e0-8675-a0e039a6e752	Checklist	INSERT	\N	{"id": 1936, "panos": null, "store": "ahu", "massas": null, "person": "Sthefani", "brownies": null, "checklist": "Checklist de Abertura", "created_at": "2026-05-28T15:02:18.753376+00:00", "money_data": {"total": 231.15, "denominacoes": {"ten": 5, "two": "", "five": 15, "fifty": "", "twenty": "", "hundred": 1, "oneCent": "", "oneReal": 4, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}}	\N	2026-05-28 15:02:18.753376+00
72b566be-8333-43b0-884d-75d5573ab9a4	Vales	INSERT	\N	{"id": 1291, "Item": "Affogato", "Nome": "Endryw", "Unidade": "Ahu", "created_at": "2026-05-28T15:39:44.39973+00:00"}	\N	2026-05-28 15:39:44.39973+00
6243604a-90b3-48c6-8f9a-2dc87c3dfbc9	Vales	INSERT	\N	{"id": 1292, "Item": "Refri, Chá ou Suco", "Nome": "Talita", "Unidade": "Alto da XV", "created_at": "2026-05-28T15:58:57.649143+00:00"}	\N	2026-05-28 15:58:57.649143+00
d0f786dd-8410-4f54-bbbe-e4f61c6a166c	Checklist	INSERT	\N	{"id": 1937, "panos": null, "store": "escritorio", "massas": null, "person": "Talita", "brownies": null, "checklist": "Checklist de Fechamento", "created_at": "2026-05-28T16:08:17.123134+00:00", "money_data": null}	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-28 16:08:17.123134+00
7b52a2f4-44f3-4939-9502-3998fb0e47f4	frequencia	INSERT	\N	{"id": 203, "date": "2026-04-28", "status": "Folga Compensatória", "observacao": null, "updated_at": "2026-05-28T17:13:45.835+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 17:13:45.832213+00
3f5111ed-68eb-48be-84d9-3500d52ce4bb	frequencia	INSERT	\N	{"id": 204, "date": "2026-05-03", "status": "Domingo de Folga", "observacao": null, "updated_at": "2026-05-28T17:16:34.409+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 17:16:34.725464+00
512df3b0-858b-40fa-a1f0-c9d138fed8d6	frequencia	INSERT	\N	{"id": 205, "date": "2026-05-31", "status": "Domingo de Folga", "observacao": null, "updated_at": "2026-05-28T17:16:58.457+00:00", "employee_id": "16ddd940-9f73-4313-ba08-9ee96735181c", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 17:16:58.47754+00
c30dfdb0-dc84-412f-bee6-5511aa5ae1c8	frequencia	INSERT	\N	{"id": 206, "date": "2026-05-03", "status": "Domingo de Folga", "observacao": null, "updated_at": "2026-05-28T17:19:18.986+00:00", "employee_id": "054e1fc1-7d77-4ae0-addb-13e440f53d6b", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 17:19:18.99163+00
55eca711-51de-49bb-82ad-54b3d1ece796	frequencia	UPDATE	{"id": 204, "date": "2026-05-03", "status": "Domingo de Folga", "observacao": null, "updated_at": "2026-05-28T17:16:34.409+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	{"id": 204, "date": "2026-05-03", "status": "Trabalhado", "observacao": null, "updated_at": "2026-05-28T17:19:39.511+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 17:19:39.485472+00
b0d1a096-6ec5-45ca-9785-11c64d442bbf	frequencia	INSERT	\N	{"id": 208, "date": "2026-05-17", "status": "Domingo de Folga", "observacao": null, "updated_at": "2026-05-28T17:19:44.586+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 17:19:44.561612+00
9200d0dc-b869-48cf-80ac-653f0b7f02f3	frequencia	UPDATE	{"id": 196, "date": "2026-05-27", "status": "Atraso", "observacao": null, "updated_at": "2026-05-28T12:55:04.26+00:00", "employee_id": "054e1fc1-7d77-4ae0-addb-13e440f53d6b", "observacao_at": null, "observacao_by": null}	{"id": 196, "date": "2026-05-27", "status": "Atraso", "observacao": "Disse que tinha uma prova para fazer e ia se atrasar", "updated_at": "2026-05-28T17:21:19.417+00:00", "employee_id": "054e1fc1-7d77-4ae0-addb-13e440f53d6b", "observacao_at": "2026-05-28T17:21:19.417+00:00", "observacao_by": "35cae5eb-f980-4be0-9998-ac8173ed2afc"}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 17:21:19.609861+00
25bb3b36-d9f7-4557-9174-5e4139fbdb2e	frequencia	INSERT	\N	{"id": 210, "date": "2026-05-10", "status": "Domingo de Folga", "observacao": null, "updated_at": "2026-05-28T17:24:45.145+00:00", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 17:24:45.393665+00
341f2c0b-b919-44df-a2fc-6c0919924ff2	frequencia	UPDATE	{"id": 208, "date": "2026-05-17", "status": "Domingo de Folga", "observacao": null, "updated_at": "2026-05-28T17:19:44.586+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	{"id": 208, "date": "2026-05-17", "status": "Domingo de Folga", "observacao": null, "updated_at": "2026-05-28T17:27:36.287+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-28 17:27:36.270963+00
0a3a4ec9-cc99-474b-8c77-d3261bf56f87	frequencia	UPDATE	{"id": 210, "date": "2026-05-10", "status": "Domingo de Folga", "observacao": null, "updated_at": "2026-05-28T17:24:45.145+00:00", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff", "observacao_at": null, "observacao_by": null}	{"id": 210, "date": "2026-05-10", "status": "Domingo de Folga", "observacao": null, "updated_at": "2026-05-28T17:28:20.002+00:00", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff", "observacao_at": null, "observacao_by": null}	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-28 17:28:19.982243+00
10bb9420-03a5-4e72-a8ab-c6afa15cb651	Vales	INSERT	\N	{"id": 1293, "Item": "COMBO SEGUNDA - Nutella e Morango", "Nome": "Amanda", "Unidade": "Alto da XV", "created_at": "2026-05-28T17:28:43.600643+00:00"}	\N	2026-05-28 17:28:43.600643+00
048a3f89-7c03-49c8-929c-8b70f236bf4a	frequencia	INSERT	\N	{"id": 213, "date": "2026-04-29", "status": "Folga Compensatória", "observacao": null, "updated_at": "2026-05-28T17:40:01.272+00:00", "employee_id": "16ddd940-9f73-4313-ba08-9ee96735181c", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 17:40:01.243839+00
22a6e2c4-af1b-407c-ad18-d9597a864936	frequencia	INSERT	\N	{"id": 214, "date": "2026-05-28", "status": "Folga Compensatória", "observacao": null, "updated_at": "2026-05-28T17:43:00.712+00:00", "employee_id": "16ddd940-9f73-4313-ba08-9ee96735181c", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 17:43:00.713539+00
9c58f240-61cc-4970-8866-cbe7c6da2b0c	frequencia	UPDATE	{"id": 214, "date": "2026-05-28", "status": "Folga Compensatória", "observacao": null, "updated_at": "2026-05-28T17:43:00.712+00:00", "employee_id": "16ddd940-9f73-4313-ba08-9ee96735181c", "observacao_at": null, "observacao_by": null}	{"id": 214, "date": "2026-05-28", "status": "Trabalhado", "observacao": null, "updated_at": "2026-05-28T17:43:13.171+00:00", "employee_id": "16ddd940-9f73-4313-ba08-9ee96735181c", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 17:43:13.154661+00
5208b828-f4b0-4ad2-963d-8c11c9887a34	frequencia	UPDATE	{"id": 141, "date": "2026-04-24", "status": "Folga Compensatória", "observacao": null, "updated_at": "2026-05-26T17:39:57.722+00:00", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff", "observacao_at": null, "observacao_by": null}	{"id": 141, "date": "2026-04-24", "status": "Folga Fixa Semanal", "observacao": null, "updated_at": "2026-05-28T17:51:23.223+00:00", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 17:51:23.471278+00
9792e66b-9d13-48f0-96b0-345e0e2891aa	frequencia	INSERT	\N	{"id": 217, "date": "2026-04-22", "status": "Trabalhado", "observacao": null, "updated_at": "2026-05-28T17:51:24.832+00:00", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 17:51:24.771977+00
1c96678b-9693-414b-a316-f6fe22fccc02	frequencia	UPDATE	{"id": 141, "date": "2026-04-24", "status": "Folga Fixa Semanal", "observacao": null, "updated_at": "2026-05-28T17:51:23.223+00:00", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff", "observacao_at": null, "observacao_by": null}	{"id": 141, "date": "2026-04-24", "status": "Folga Fixa Semanal", "observacao": "Trocou Quarta pela Sexta como folga fixa semanal", "updated_at": "2026-05-28T17:51:37.367+00:00", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff", "observacao_at": "2026-05-28T17:51:37.367+00:00", "observacao_by": "35cae5eb-f980-4be0-9998-ac8173ed2afc"}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 17:51:37.360612+00
35a29c08-a1c1-4ff5-8097-c328513887e8	frequencia	UPDATE	{"id": 141, "date": "2026-04-24", "status": "Folga Fixa Semanal", "observacao": "Trocou Quarta pela Sexta como folga fixa semanal", "updated_at": "2026-05-28T17:51:37.367+00:00", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff", "observacao_at": "2026-05-28T17:51:37.367+00:00", "observacao_by": "35cae5eb-f980-4be0-9998-ac8173ed2afc"}	{"id": 141, "date": "2026-04-24", "status": "Folga Fixa Semanal", "observacao": "Trocou Quarta pela Sexta como folga fixa semanal\\nDias 22 e 24", "updated_at": "2026-05-28T17:51:49.095+00:00", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff", "observacao_at": "2026-05-28T17:51:49.095+00:00", "observacao_by": "35cae5eb-f980-4be0-9998-ac8173ed2afc"}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 17:51:49.0309+00
b55b0eaa-ef3e-4124-a381-47d6e49659ca	Vales	INSERT	\N	{"id": 1294, "Item": "Latte", "Nome": "Sthefani", "Unidade": "Ahu", "created_at": "2026-05-28T18:32:52.769426+00:00"}	\N	2026-05-28 18:32:52.769426+00
0d79db86-d699-4ddb-832b-456777a19ceb	Vales	INSERT	\N	{"id": 1295, "Item": "Refri, Chá ou Suco", "Nome": "Cassia", "Unidade": "Alto da XV", "created_at": "2026-05-28T18:34:22.882186+00:00"}	\N	2026-05-28 18:34:22.882186+00
d8e812a0-93a3-408a-a64a-7478f92336bb	profiles	UPDATE	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "joao", "ativo": false, "email": "joao@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-28T13:01:01.999+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "joao", "ativo": true, "email": "joao@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-28T20:10:28.839+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 20:10:28.540581+00
2ed33d77-8ec0-473e-9283-9e7b0ecde036	profiles	UPDATE	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "joao", "ativo": true, "email": "joao@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-28T20:10:28.839+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "teste", "ativo": true, "email": "teste@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-28T20:10:38.422+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 20:10:38.097887+00
a6e377a0-2b9a-442d-a58d-57dfa313d857	frequencia	UPDATE	{"id": 130, "date": "2026-04-11", "status": "Falta Não Justificada", "observacao": null, "updated_at": "2026-05-26T17:36:09.036+00:00", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff", "observacao_at": null, "observacao_by": null}	{"id": 130, "date": "2026-04-11", "status": "Folga Compensatória", "observacao": null, "updated_at": "2026-05-28T20:18:10.118+00:00", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 20:18:09.901033+00
93f5b596-1f1b-48db-a64b-be7ff07364bf	frequencia	UPDATE	{"id": 145, "date": "2026-04-26", "status": "Falta Não Justificada", "observacao": null, "updated_at": "2026-05-26T17:44:31.775+00:00", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff", "observacao_at": null, "observacao_by": null}	{"id": 145, "date": "2026-04-26", "status": "Folga Compensatória", "observacao": null, "updated_at": "2026-05-28T20:18:13.078+00:00", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 20:18:12.823242+00
4e5b5eac-698c-4bdb-a173-4c8751aa0cc5	profiles	UPDATE	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "teste", "ativo": true, "email": "teste@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-28T20:10:38.422+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "teste", "ativo": true, "email": "teste@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-28T20:18:51.719+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": false}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 20:18:51.39727+00
3ac60dc2-737b-44e9-8de1-56d30f4388be	frequencia	UPDATE	{"id": 118, "date": "2026-05-15", "status": "Trabalhado", "observacao": null, "updated_at": "2026-05-26T17:31:34.107+00:00", "employee_id": "054e1fc1-7d77-4ae0-addb-13e440f53d6b", "observacao_at": null, "observacao_by": null}	{"id": 118, "date": "2026-05-15", "status": "Folga Fixa Semanal", "observacao": null, "updated_at": "2026-05-28T20:40:42.902+00:00", "employee_id": "054e1fc1-7d77-4ae0-addb-13e440f53d6b", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 20:40:42.812108+00
df35dfb8-f471-4da1-b3e3-13f5c0399de4	frequencia	UPDATE	{"id": 152, "date": "2026-05-19", "status": "Folga Compensatória", "observacao": null, "updated_at": "2026-05-26T17:49:12.129+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	{"id": 152, "date": "2026-05-19", "status": "Trabalhado", "observacao": null, "updated_at": "2026-05-28T20:42:29.871+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 20:42:30.038116+00
9bb2e699-a8e0-4cad-8b87-97a19864a5af	frequencia	UPDATE	{"id": 152, "date": "2026-05-19", "status": "Trabalhado", "observacao": null, "updated_at": "2026-05-28T20:42:29.871+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	{"id": 152, "date": "2026-05-19", "status": "Folga Compensatória", "observacao": null, "updated_at": "2026-05-28T20:42:35.039+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 20:42:34.923176+00
cb2efa2a-2a34-401a-8788-b9c7c9675ef0	profiles	UPDATE	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "teste", "ativo": true, "email": "teste@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-28T20:18:51.719+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": false}	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "teste", "ativo": false, "email": "teste@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-28T20:43:29.62+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": false}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 20:43:29.319865+00
8ec21ff1-9122-403b-9eea-79c4d2dd4ad8	Vales	INSERT	\N	{"id": 1296, "Item": "Gelato Carmella - 60gr", "Nome": "Sthefani", "Unidade": "Ahu", "created_at": "2026-05-28T21:45:03.826892+00:00"}	\N	2026-05-28 21:45:03.826892+00
ed086aa8-d789-4c6e-9c5a-ee3472d4c1ab	Vales	INSERT	\N	{"id": 1297, "Item": "Refri, Chá ou Suco", "Nome": "Sthefani", "Unidade": "Ahu", "created_at": "2026-05-28T21:58:32.670817+00:00"}	\N	2026-05-28 21:58:32.670817+00
02f5929b-72aa-4ead-bfb1-19163c20f1c7	Vales	INSERT	\N	{"id": 1298, "Item": "Refri, Chá ou Suco", "Nome": "Sthefani", "Unidade": "Ahu", "created_at": "2026-05-28T21:58:49.62227+00:00"}	\N	2026-05-28 21:58:49.62227+00
a1374965-c3d3-4bf4-bb00-d4c9163d9a84	Checklist	INSERT	\N	{"id": 1938, "panos": "7", "store": "ahu", "massas": "3 [3 (venc. 30/05/2026)]", "person": "Sthefani", "brownies": "4 [4 (venc. 17/06/2026)]", "checklist": "Checklist de Fechamento", "created_at": "2026-05-28T22:02:22.599495+00:00", "money_data": null}	\N	2026-05-28 22:02:22.599495+00
475ce5f0-e994-4c21-92dd-a3102021e25c	Checklist	INSERT	\N	{"id": 1939, "panos": "3", "store": "altoxv", "massas": "4 [4 (venc. 04/06/2026)]", "person": "Amanda", "brownies": "3 [3 (venc. 17/06/2026)]", "checklist": "Checklist de Fechamento", "created_at": "2026-05-28T22:02:43.53474+00:00", "money_data": null}	\N	2026-05-28 22:02:43.53474+00
de5fa43f-a67a-4b84-b6d0-14832ea29911	frequencia	INSERT	\N	{"id": 225, "date": "2026-05-02", "status": "Atraso", "observacao": null, "updated_at": "2026-05-29T13:55:40.923+00:00", "employee_id": "16ddd940-9f73-4313-ba08-9ee96735181c", "observacao_at": null, "observacao_by": null}	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-29 13:55:39.80301+00
55c62a07-26f1-4f3e-a973-f1bc23b09190	frequencia	INSERT	\N	{"id": 226, "date": "2026-05-03", "status": "Atraso", "observacao": null, "updated_at": "2026-05-29T13:55:43.411+00:00", "employee_id": "16ddd940-9f73-4313-ba08-9ee96735181c", "observacao_at": null, "observacao_by": null}	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-29 13:55:42.267912+00
4bc9b5f2-2d02-4168-886f-442f50c3e0ff	frequencia	INSERT	\N	{"id": 227, "date": "2026-05-11", "status": "Atraso", "observacao": null, "updated_at": "2026-05-29T13:56:12.918+00:00", "employee_id": "16ddd940-9f73-4313-ba08-9ee96735181c", "observacao_at": null, "observacao_by": null}	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-29 13:56:11.759497+00
d766307c-972f-4244-a2ee-4154e6adcf26	frequencia	INSERT	\N	{"id": 228, "date": "2026-05-13", "status": "Atraso", "observacao": null, "updated_at": "2026-05-29T13:56:17.326+00:00", "employee_id": "16ddd940-9f73-4313-ba08-9ee96735181c", "observacao_at": null, "observacao_by": null}	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-29 13:56:16.150747+00
ff17c11a-fdde-49ce-b561-d35212da419d	frequencia	INSERT	\N	{"id": 229, "date": "2026-05-05", "status": "Atraso", "observacao": null, "updated_at": "2026-05-29T13:57:46.061+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-29 13:57:44.893022+00
8d086327-222f-44b5-bfaa-ac2e6c343cd4	frequencia	INSERT	\N	{"id": 230, "date": "2026-05-12", "status": "Atraso", "observacao": null, "updated_at": "2026-05-29T13:58:02.061+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-29 13:58:00.893049+00
2682bc2a-9a2f-4dc3-ac5b-6d3933eaf2e0	frequencia	INSERT	\N	{"id": 231, "date": "2026-05-14", "status": "Atraso", "observacao": null, "updated_at": "2026-05-29T13:58:15.221+00:00", "employee_id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "observacao_at": null, "observacao_by": null}	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-29 13:58:14.052513+00
abec4746-9428-47f0-b840-557e6650e1df	frequencia	INSERT	\N	{"id": 232, "date": "2026-05-18", "status": "Atraso", "observacao": null, "updated_at": "2026-05-29T14:00:55.72+00:00", "employee_id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff", "observacao_at": null, "observacao_by": null}	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-29 14:00:54.551169+00
ca6c934e-43c2-41a1-ad9d-bbd656dfaab6	frequencia	INSERT	\N	{"id": 233, "date": "2026-05-12", "status": "Atraso", "observacao": null, "updated_at": "2026-05-29T14:06:57.113+00:00", "employee_id": "1d621888-613a-4a15-b796-3c4120f51af2", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-29 14:06:55.94653+00
c8ff3552-60a0-4253-9458-fddb0734fc9b	frequencia	INSERT	\N	{"id": 234, "date": "2026-05-15", "status": "Atraso", "observacao": null, "updated_at": "2026-05-29T14:07:01.037+00:00", "employee_id": "1d621888-613a-4a15-b796-3c4120f51af2", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-29 14:06:59.85889+00
448943df-3c52-4973-af50-3a377c6b09b8	frequencia	INSERT	\N	{"id": 235, "date": "2026-05-18", "status": "Atraso", "observacao": null, "updated_at": "2026-05-29T14:07:17.153+00:00", "employee_id": "1d621888-613a-4a15-b796-3c4120f51af2", "observacao_at": null, "observacao_by": null}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-29 14:07:15.980489+00
a179fb24-b4b7-4fc1-a130-4ad640df1a33	Vales	INSERT	\N	{"id": 1299, "Item": "Latte", "Nome": "Sthefani", "Unidade": "Ahu", "created_at": "2026-05-29T14:43:25.784386+00:00"}	\N	2026-05-29 14:43:25.784386+00
3b938fab-fc0b-4c86-92f6-9920ac312c23	Checklist	INSERT	\N	{"id": 1940, "panos": null, "store": "altoxv", "massas": null, "person": "Amanda", "brownies": null, "checklist": "Checklist de Abertura", "created_at": "2026-05-29T15:04:25.7956+00:00", "money_data": {"total": 436.5, "denominacoes": {"ten": 8, "two": 5, "five": "", "fifty": "", "twenty": 12, "hundred": 1, "oneCent": "", "oneReal": 5, "tenCents": 12, "fiveCents": 6, "fiftyCents": "", "twentyFiveCents": ""}}}	\N	2026-05-29 15:04:25.7956+00
749a4ea6-4784-4683-8d99-a75e07ec9442	Vales	INSERT	\N	{"id": 1300, "Item": "Refri, Chá ou Suco", "Nome": "Talita", "Unidade": "Alto da XV", "created_at": "2026-05-29T16:00:31.762737+00:00"}	\N	2026-05-29 16:00:31.762737+00
a9032fe9-84ad-4376-a06d-280687a6f36a	Checklist	INSERT	\N	{"id": 1941, "panos": null, "store": "escritorio", "massas": null, "person": "Talita", "brownies": null, "checklist": "Checklist de Fechamento", "created_at": "2026-05-29T16:00:47.406754+00:00", "money_data": null}	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-29 16:00:47.406754+00
4e11e213-5bbf-4cf9-b1aa-fddc93629bef	Vales	INSERT	\N	{"id": 1301, "Item": "Affogato", "Nome": "Talita", "Unidade": "Alto da XV", "created_at": "2026-05-29T16:59:43.367014+00:00"}	\N	2026-05-29 16:59:43.367014+00
ae69960a-8a87-4644-9e6f-74191cb45ba2	Checklist	INSERT	\N	{"id": 1947, "panos": "3", "store": "ahu", "massas": "10 [10 (venc. 04/06/2026)]", "person": "Sthefani", "brownies": "4 [4 (venc. 17/06/2026)]", "checklist": "Checklist de Fechamento", "created_at": "2026-05-30T22:01:59.932758+00:00", "money_data": null}	\N	2026-05-30 22:01:59.932758+00
4244116b-ab40-4129-a98f-0a762d1692ed	Checklist	INSERT	\N	{"id": 1942, "panos": null, "store": "ahu", "massas": null, "person": "Sthefani", "brownies": null, "checklist": "Checklist de Abertura", "created_at": "2026-05-29T17:21:24.388601+00:00", "money_data": {"total": 231.15, "denominacoes": {"ten": 5, "two": "", "five": 15, "fifty": "", "twenty": "", "hundred": 1, "oneCent": "", "oneReal": 4, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}}	\N	2026-05-29 17:21:24.388601+00
0e5f6d91-ecf0-43ed-95a5-ca35fe120ae1	Vales	INSERT	\N	{"id": 1302, "Item": "Água", "Nome": "Sthefani", "Unidade": "Ahu", "created_at": "2026-05-29T17:21:31.860825+00:00"}	\N	2026-05-29 17:21:31.860825+00
102052aa-0c44-4528-bec7-b51b2633e770	profiles	UPDATE	{"id": "054e1fc1-7d77-4ae0-addb-13e440f53d6b", "name": "Cassia", "ativo": true, "email": "cassiafernanda344@gmail.com", "is_admin": false, "short_id": "6736", "updated_at": "2026-05-26T12:38:52.771+00:00", "folgas_fixas": "5", "data_registro": null, "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	{"id": "054e1fc1-7d77-4ae0-addb-13e440f53d6b", "name": "Cassia", "ativo": true, "email": "cassiafernanda344@gmail.com", "is_admin": false, "short_id": "6736", "updated_at": "2026-05-29T17:49:42.498+00:00", "folgas_fixas": "5", "data_registro": "2026-02-12", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-29 17:49:42.602073+00
9c2f8482-e231-47de-a142-535cb2d1cbbe	profiles	UPDATE	{"id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "name": "Endryw", "ativo": true, "email": "endrywgabrielx@gmail.com", "is_admin": false, "short_id": "9845", "updated_at": "2026-05-26T12:38:47.139+00:00", "folgas_fixas": "1", "data_registro": null, "passagens_urbs": 1, "passagens_metrocard": 1, "controlar_frequencia": true}	{"id": "c24dd627-7a1e-407e-9fe0-eefe4d5320c7", "name": "Endryw", "ativo": true, "email": "endrywgabrielx@gmail.com", "is_admin": false, "short_id": "9845", "updated_at": "2026-05-29T17:52:28.262+00:00", "folgas_fixas": "1", "data_registro": "2026-01-16", "passagens_urbs": 1, "passagens_metrocard": 1, "controlar_frequencia": true}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-29 17:52:28.374625+00
157c9fe6-ef17-4ff9-ab3e-b4b41ffae39b	profiles	UPDATE	{"id": "1d621888-613a-4a15-b796-3c4120f51af2", "name": "Talita", "ativo": true, "email": "mh.escritoriocarmella@gmail.com", "is_admin": false, "short_id": "2836", "updated_at": "2026-05-26T12:38:28.337+00:00", "folgas_fixas": "6,0", "data_registro": null, "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	{"id": "1d621888-613a-4a15-b796-3c4120f51af2", "name": "Talita", "ativo": true, "email": "mh.escritoriocarmella@gmail.com", "is_admin": false, "short_id": "2836", "updated_at": "2026-05-29T17:52:59.078+00:00", "folgas_fixas": "6,0", "data_registro": "2025-11-13", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": true}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-29 17:52:59.177527+00
a614c6f8-db3b-494c-9589-ae099010e482	profiles	UPDATE	{"id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff", "name": "Sthefani", "ativo": true, "email": "sthefani.alves.def@gmail.com", "is_admin": false, "short_id": "2982", "updated_at": "2026-05-26T12:59:15.329+00:00", "folgas_fixas": "3", "data_registro": null, "passagens_urbs": 1, "passagens_metrocard": 1, "controlar_frequencia": true}	{"id": "3e43c2e5-3604-48ad-807a-bfa38ebdbfff", "name": "Sthefani", "ativo": true, "email": "sthefani.alves.def@gmail.com", "is_admin": false, "short_id": "2982", "updated_at": "2026-05-29T17:53:23.527+00:00", "folgas_fixas": "3", "data_registro": "2025-05-05", "passagens_urbs": 1, "passagens_metrocard": 1, "controlar_frequencia": true}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-29 17:53:23.616103+00
51a9cc72-bd27-43da-ac3c-a14b52f7bdae	historico_colaborador	INSERT	\N	{"id": 15, "date": "2026-05-16", "type": "Advertência", "title": "Advertência", "created_at": "2026-05-29T18:00:15.401779+00:00", "created_by": "35cae5eb-f980-4be0-9998-ac8173ed2afc", "description": "Conduta inadequada, permitindo a entrada de um animal de rua nas dependências da loja", "employee_id": "16ddd940-9f73-4313-ba08-9ee96735181c"}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-29 18:00:15.401779+00
da531599-1c38-4aff-9096-48193864c9a1	Vales	INSERT	\N	{"id": 1303, "Item": "Waffle de Liege", "Nome": "Amanda", "Unidade": "Alto da XV", "created_at": "2026-05-29T21:53:58.094877+00:00"}	\N	2026-05-29 21:53:58.094877+00
4c95d595-f709-4c10-90ab-859fed1186fe	Vales	INSERT	\N	{"id": 1304, "Item": "Nutella - 40gr", "Nome": "Amanda", "Unidade": "Alto da XV", "created_at": "2026-05-29T21:54:10.324602+00:00"}	\N	2026-05-29 21:54:10.324602+00
b30b0995-6e5f-4e30-8fea-bd33933f4310	Checklist	INSERT	\N	{"id": 1943, "panos": "06", "store": "ahu", "massas": "13 [10 (venc. 04/06/2026), 3 (venc. 30/05/2026)]", "person": "Sthefani", "brownies": "4 [4 (venc. 17/06/2026)]", "checklist": "Checklist de Fechamento", "created_at": "2026-05-29T22:02:58.808126+00:00", "money_data": null}	\N	2026-05-29 22:02:58.808126+00
67b983e6-3820-4e5e-9872-1032a60d233b	Checklist	INSERT	\N	{"id": 1944, "panos": "2", "store": "altoxv", "massas": "12 [3 (venc. 04/06/2026), 9 (venc. 04/06/2026)]", "person": "Amanda", "brownies": "3 [3 (venc. 17/06/2026)]", "checklist": "Checklist de Fechamento", "created_at": "2026-05-29T22:06:15.779256+00:00", "money_data": null}	\N	2026-05-29 22:06:15.779256+00
c55a216a-0e86-42e5-b86e-473246ab8509	profiles	UPDATE	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "teste", "ativo": false, "email": "teste@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-28T20:43:29.62+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": false}	{"id": "cb8fbe48-feb4-45e6-92bd-e43f55c3e8d3", "name": "teste", "ativo": true, "email": "teste@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-05-30T02:51:18.12+00:00", "folgas_fixas": "4", "data_registro": "2026-05-20", "passagens_urbs": 2, "passagens_metrocard": 0, "controlar_frequencia": false}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-30 02:51:19.895288+00
824f8350-f224-461d-be50-508fa438f46a	Checklist	INSERT	\N	{"id": 1945, "panos": null, "store": "ahu", "massas": null, "person": "Sthefani", "brownies": null, "checklist": "Checklist de Abertura", "created_at": "2026-05-30T15:02:37.244665+00:00", "money_data": {"total": 231.15, "denominacoes": {"ten": 5, "two": "", "five": 15, "fifty": "", "twenty": "", "hundred": 1, "oneCent": "", "oneReal": 4, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 3}}}	\N	2026-05-30 15:02:37.244665+00
7adfa3bf-4c4a-409d-a869-4da967130c64	Checklist	INSERT	\N	{"id": 1946, "panos": null, "store": "altoxv", "massas": null, "person": "Cassia", "brownies": null, "checklist": "Checklist de Abertura", "created_at": "2026-05-30T15:04:27.698694+00:00", "money_data": {"total": 336.5, "denominacoes": {"ten": 8, "two": 5, "five": "", "fifty": "", "twenty": 12, "hundred": "", "oneCent": "", "oneReal": 5, "tenCents": 12, "fiveCents": 6, "fiftyCents": "", "twentyFiveCents": ""}}}	\N	2026-05-30 15:04:27.698694+00
224f8bf4-5f51-49f6-9766-c46bde2a367d	Vales	INSERT	\N	{"id": 1305, "Item": "Mocha", "Nome": "Sthefani", "Unidade": "Ahu", "created_at": "2026-05-30T15:08:03.21058+00:00"}	\N	2026-05-30 15:08:03.21058+00
9e508517-4cd9-4ac9-bdd9-e05dbcbea494	Vales	INSERT	\N	{"id": 1306, "Item": "Refri, Chá ou Suco", "Nome": "Cassia", "Unidade": "Alto da XV", "created_at": "2026-05-30T18:34:14.349761+00:00"}	\N	2026-05-30 18:34:14.349761+00
12b86658-4143-478b-b794-85127c9b5c4b	Checklist	INSERT	\N	{"id": 1948, "panos": "1", "store": "altoxv", "massas": "8 [8 (venc. 04/06/2026)]", "person": "Cassia", "brownies": "3 [3 (venc. 17/06/2026)]", "checklist": "Checklist de Fechamento", "created_at": "2026-05-30T22:03:04.594746+00:00", "money_data": null}	\N	2026-05-30 22:03:04.594746+00
293c8bfb-4d57-4804-afc8-a354f13b0698	Vales	INSERT	\N	{"id": 1307, "Item": "Latte", "Nome": "Sthefani", "Unidade": "Ahu", "created_at": "2026-05-31T14:56:16.386118+00:00"}	\N	2026-05-31 14:56:16.386118+00
7e123884-4fd1-4905-83b5-b2d8e4743e0b	Checklist	INSERT	\N	{"id": 1949, "panos": null, "store": "ahu", "massas": null, "person": "Sthefani", "brownies": null, "checklist": "Checklist de Abertura", "created_at": "2026-05-31T15:02:15.298033+00:00", "money_data": {"total": 184.65, "denominacoes": {"ten": 12, "two": 7, "five": 8, "fifty": "", "twenty": "", "hundred": "", "oneCent": "", "oneReal": 9, "tenCents": 14, "fiveCents": "", "fiftyCents": "", "twentyFiveCents": 1}}}	\N	2026-05-31 15:02:15.298033+00
b704f4a0-d47f-4bcd-82aa-d5cb21f62516	Checklist	INSERT	\N	{"id": 1950, "panos": null, "store": "altoxv", "massas": null, "person": "Cassia", "brownies": null, "checklist": "Checklist de Abertura", "created_at": "2026-05-31T15:13:05.688248+00:00", "money_data": {"total": 355.5, "denominacoes": {"ten": 8, "two": 5, "five": "", "fifty": "", "twenty": 13, "hundred": "", "oneCent": "", "oneReal": 4, "tenCents": 12, "fiveCents": 6, "fiftyCents": "", "twentyFiveCents": ""}}}	\N	2026-05-31 15:13:05.688248+00
d652ff9a-1ae2-4303-a943-3d6f86bbfa93	Vales	INSERT	\N	{"id": 1308, "Item": "Doce de Leite - 40gr", "Nome": "Sthefani", "Unidade": "Ahu", "created_at": "2026-05-31T15:13:29.039176+00:00"}	\N	2026-05-31 15:13:29.039176+00
d3462c88-41e6-464c-b730-dd6ea78a9ea1	Vales	INSERT	\N	{"id": 1309, "Item": "Affogato", "Nome": "Endryw", "Unidade": "Ahu", "created_at": "2026-05-31T16:27:08.27319+00:00"}	\N	2026-05-31 16:27:08.27319+00
d91dec20-b0bc-4c4c-b064-9a53d2add63e	Vales	INSERT	\N	{"id": 1310, "Item": "Refri, Chá ou Suco", "Nome": "Cassia", "Unidade": "Alto da XV", "created_at": "2026-05-31T16:30:12.672204+00:00"}	\N	2026-05-31 16:30:12.672204+00
a7a0e9e2-225a-4f95-85e9-2cb6ac77cbbc	Vales	INSERT	\N	{"id": 1311, "Item": "Refri, Chá ou Suco", "Nome": "Sthefani", "Unidade": "Ahu", "created_at": "2026-05-31T16:34:41.61927+00:00"}	\N	2026-05-31 16:34:41.61927+00
2f05925d-277b-4ef1-bad0-5e43749192c3	Vales	INSERT	\N	{"id": 1312, "Item": "Refri, Chá ou Suco", "Nome": "Endryw", "Unidade": "Ahu", "created_at": "2026-05-31T17:36:54.852235+00:00"}	\N	2026-05-31 17:36:54.852235+00
2097b45a-1857-4c59-b030-8a453a040922	Checklist	INSERT	\N	{"id": 1951, "panos": "0", "store": "altoxv", "massas": "6 [6 (venc. 04/06/2026)]", "person": "Cassia", "brownies": "7 [7 (venc. 30/06/2026)]", "checklist": "Checklist de Fechamento", "created_at": "2026-05-31T22:07:41.87814+00:00", "money_data": null}	\N	2026-05-31 22:07:41.87814+00
a64c3e24-ffa0-4dd8-8dde-66f81520f762	Checklist	INSERT	\N	{"id": 1952, "panos": "2", "store": "ahu", "massas": "4 [4 (venc. 04/06/2026)]", "person": "Sthefani", "brownies": "1 [1 (venc. 17/06/2026)]", "checklist": "Checklist de Fechamento", "created_at": "2026-05-31T22:16:54.184487+00:00", "money_data": null}	\N	2026-05-31 22:16:54.184487+00
8cdcbb89-56ce-48ab-87e3-e2146ef383c6	Vales	INSERT	\N	{"id": 1313, "Item": "Capuccino Brasileiro", "Nome": "Sthefani", "Unidade": "Ahu", "created_at": "2026-05-31T22:17:03.50959+00:00"}	\N	2026-05-31 22:17:03.50959+00
0a743f1a-ccca-44cc-b0be-e21dee96744c	Vales	INSERT	\N	{"id": 1314, "Item": "Pote 480ml", "Nome": "Endryw", "Unidade": "Ahu", "created_at": "2026-05-31T22:21:34.291322+00:00"}	\N	2026-05-31 22:21:34.291322+00
e8de1c2d-87d6-45db-abd9-27a1d5353a95	Vales	INSERT	\N	{"id": 1315, "Item": "Refri, Chá ou Suco", "Nome": "Endryw", "Unidade": "Ahu", "created_at": "2026-05-31T22:21:44.941414+00:00"}	\N	2026-05-31 22:21:44.941414+00
0e3c85f3-2eab-4f2f-9ce2-5e980027ac65	profiles	INSERT	\N	{"id": "b5668aed-dbb4-4d19-918e-c4e62e308487", "name": "mh.loja.ahu", "ativo": true, "email": "mh.loja.ahu@gmail.com", "is_admin": false, "short_id": null, "updated_at": "2026-06-01T00:51:42.713235+00:00", "folgas_fixas": "", "data_registro": null, "passagens_urbs": 0, "passagens_metrocard": 0, "controlar_frequencia": true}	\N	2026-06-01 00:51:42.713235+00
7d81ccb2-101a-4e07-a637-992f3e151836	profiles	UPDATE	{"id": "b5668aed-dbb4-4d19-918e-c4e62e308487", "name": "mh.loja.ahu", "ativo": true, "email": "mh.loja.ahu@gmail.com", "is_admin": false, "short_id": null, "updated_at": "2026-06-01T00:51:42.713235+00:00", "folgas_fixas": "", "data_registro": null, "passagens_urbs": 0, "passagens_metrocard": 0, "controlar_frequencia": true}	{"id": "b5668aed-dbb4-4d19-918e-c4e62e308487", "name": "Loja Ahu", "ativo": true, "email": "mh.loja.ahu@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-06-01T00:51:42.697+00:00", "folgas_fixas": "", "data_registro": null, "passagens_urbs": 0, "passagens_metrocard": 0, "controlar_frequencia": false}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-06-01 00:51:42.868684+00
ebe8e285-5a9b-410e-98f8-003d9149557c	profiles	INSERT	\N	{"id": "d68a59d3-2331-4ada-a377-60659501c047", "name": "mh.loja.altoxv", "ativo": true, "email": "mh.loja.altoxv@gmail.com", "is_admin": false, "short_id": null, "updated_at": "2026-06-01T00:52:00.100717+00:00", "folgas_fixas": "", "data_registro": null, "passagens_urbs": 0, "passagens_metrocard": 0, "controlar_frequencia": true}	\N	2026-06-01 00:52:00.100717+00
3d83b208-0265-4132-aa01-590b32983140	profiles	UPDATE	{"id": "d68a59d3-2331-4ada-a377-60659501c047", "name": "mh.loja.altoxv", "ativo": true, "email": "mh.loja.altoxv@gmail.com", "is_admin": false, "short_id": null, "updated_at": "2026-06-01T00:52:00.100717+00:00", "folgas_fixas": "", "data_registro": null, "passagens_urbs": 0, "passagens_metrocard": 0, "controlar_frequencia": true}	{"id": "d68a59d3-2331-4ada-a377-60659501c047", "name": "Loja Alto XV", "ativo": true, "email": "mh.loja.altoxv@gmail.com", "is_admin": false, "short_id": "", "updated_at": "2026-06-01T00:52:00.005+00:00", "folgas_fixas": "", "data_registro": null, "passagens_urbs": 0, "passagens_metrocard": 0, "controlar_frequencia": false}	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-06-01 00:52:00.26694+00
\.


--
-- Data for Name: cadastro_insumos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."cadastro_insumos" ("id", "nome", "nome_simples_unitario", "tipo", "fornecedor_padrao", "quantidade_conversao", "unidade_conversao", "custo_considerado", "ativo", "created_at", "config_estoque", "ordem", "custo_considerado_unitario", "fator_desperdicio") FROM stdin;
401a7884-fdcf-4e25-9491-fa69d4eafaa3	Copo Papel Preto Parede Dupla 270ml - c/ 25un	Copo de Papel Preto Parede Dupla 270ml	Insumos	Sete Embalagens	25	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	15	\N	0
df300a01-1ac7-4d10-b0fc-a943418d9870	Embalagem Waffle Cama - c/ 50un		Insumos		50	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	16	\N	0
6e0e7651-b4a0-466f-9541-69d45b2ffdca	Gelato - Kg	Gelato - Kg	Insumos	Fábrica	1	Kg	14	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": false}, "altoxv": {"ativo": false}}	0	14	0
991d2a77-66a8-4811-9ba7-fc60329e3729	Sacola P - 26x25x12cm - c/ 20un	Sacola P - 26x25x12cm	Insumos	Nobelpack	20	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	18	\N	0
26aac066-5610-472e-a260-a57ba1f0c5df	Limão Tahiti - Kg	Limão Tahiti	Matéria Prima	Mercado	1	Kg	\N	t	2026-05-31 15:36:53.230497+00	{"fabrica": {"ativo": true}}	130	\N	10
33ede6d7-bf58-4451-83ea-0266023a2403	Embalagem Waffle Luva - c/ 50un		Insumos		50	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	17	\N	0
e477c9c1-65f1-44b6-a4b1-3743e900407c	Sanduíche de Carne - 1un		Salgados	Cassinele	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true, "minimo": 6, "desejado": 12}, "altoxv": {"ativo": true, "minimo": 6, "desejado": 12}}	27	\N	0
0601ca6a-bb0b-41eb-abe0-a40319cca32b	Sacola PP - 25x21x10cm - c/ 20un	Sacola PP - 25x21x10cm	Insumos	Nobelpack	20	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	19	\N	0
25ceab99-154c-4cd1-b027-16263db22a03	Long Drink Transparente 325ml - "Copo Soda Italiana"	Copo p/ Soda Italiana	Insumos		1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true, "minimo": null}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	45	\N	0
9be2a16a-0f99-4667-ac5a-88b73b27d0cd	Etiqueta Adesivo Redonda TP19 Preta - (PIMACO) - c/ 200un		Insumos	Kalunga	200	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	65	\N	0
ad8f9a85-62de-4875-9cd6-b831d9ff8887	Bobina Impressora - 80mm		Insumos	Mercado Livre	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	67	\N	0
893474b7-622b-4036-bb42-66ac53c54e07	Recheio de chocolate Branco Nestlé Galak - 1kg	Recheio de chocolate Branco Nestlé Galak	Insumos	Mercado Livre	1	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	124	\N	0
7693fa82-65fc-4d1b-bbcb-73a0a34728a0	Xarope de Framboesa - 750ml	Xarope Monin Framboesa	Insumos		0.75	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": false}, "altoxv": {"ativo": false}}	80	\N	0
481e2a7b-ca33-4d5d-901d-405f2321f624	Xarope de Baunilha - 750ml	Xarope Monin Baunilha	Insumos		0.75	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	82	\N	0
d7372dd2-15df-4cff-8767-51fecdba54c5	Tampa p/ Pote Kraft 480ml - c/ 50un	Tampa p/ Pote Kraft 480ml	Insumos	FNS Cups	50	Unidade	\N	f	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	6	\N	0
e59a1f84-380b-4081-a901-a6ed946a6d69	Pote Kraft 480ml - c/ 50un	Pote Kraft 480ml	Insumos	FNS Cups	50	Unidade	\N	f	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	5	\N	0
75efd75a-2265-49dc-8b10-ee0332a12025	Desinfetante Pato	Desinfetante Pato	Material de Limpeza	Mercado	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	87	\N	0
cae71c5c-32f2-4882-8fbe-042c7ed421ff	Schweppes Tônica - Lata - (350ml)	Schweppes Tônica - Lata - (350ml)	Bebidas	Distribuidor de Bebidas	1	Unidade	\N	f	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	104	\N	0
9e029ad3-c02c-4887-bd60-d1bd5a417210	Mini Disqueti - Chocolate ao Leite - 11gr	Mini Disqueti - 11gr - Unidade	Insumos		1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	127	\N	0
cad0f122-104f-4cdd-8da9-01ad147ecba8	Sanduíche de Frango - 1un		Salgados	Cassinele	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true, "minimo": 6, "desejado": 12}, "altoxv": {"ativo": true, "minimo": 6, "desejado": 12}}	28	\N	0
185e009c-0cb9-42dd-adeb-ebfd15e99e0f	Sanduíche de Pernil - 1un		Salgados	Cassinele	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true, "minimo": 6, "desejado": 12}, "altoxv": {"ativo": true, "minimo": 6, "desejado": 12}}	29	\N	0
73a8818d-24aa-4964-8af0-2f8b9cb17674	Xarope de Maça Verde - 750ml	Xarope Monin Maça Verde	Insumos		0.75	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": false}, "altoxv": {"ativo": false}}	79	\N	0
2555e2a3-f854-4a02-8ee6-a67e6a97a409	Xarope de Tangerina - 250ml	Xarope Monin Tangerina	Insumos		0.25	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	76	\N	0
2bb85cf5-b71d-4cdf-ac7b-27256d21851d	Doce de Leite - 350gr	Doce de Leite	Insumos	Condor	0.35	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	26	\N	0
a6e2564d-a560-4ff2-81a5-6f4f32d93ac2	Quiche Capresse - 1un		Salgados	Cassinele	1	Unidade	\N	f	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": false}, "altoxv": {"ativo": false}}	33	\N	0
95d9f130-2433-4f3e-882b-e420e62254e4	Colher Forte - c/ 50un (STRAWPLAST)		Insumos		50	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	51	\N	0
a28e10c8-33ef-450b-b49e-6c337036c092	Papel Barreira 20x20 c/ 1.000 folhas		Insumos	Mercado Livre	1000	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	57	\N	0
1fc18535-6e74-4ac2-819c-40fe870a1cc8	Luva de vinil sem pó - Tamanho M - c/100un		Insumos	Marmikok	100	Unidade	\N	f	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	59	\N	0
cb231406-2867-408c-a9e2-1d335ab8b08f	Açúcar Refinado - 5kg	Açúcar Refinado	Matéria Prima	Mercado	5	Kg	\N	t	2026-05-31 15:39:18.264013+00	{"fabrica": {"ativo": true}}	131	\N	0
1da7ddfd-5b9f-4e51-9256-fa2bd0034ef3	Sachê de Adoçante		Insumos		1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	71	\N	0
e355760e-3631-4e40-9b0c-d710b1898d9d	Luva de vinil sem pó - Tamanho G - c/ 100un		Insumos	Marmikok	100	Unidade	\N	f	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	60	\N	0
e128a46c-38f5-484f-8ee0-d78c6da749f5	Grampo p/ Grampeador		Insumos	Papelaria	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	66	\N	0
cfda70c4-3730-4fad-8c5e-82ef55c4ee7f	Lacre Ifood		Insumos		1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	72	\N	0
3450202d-4b44-4aa7-83b9-d5648fb0c84a	Xarope de Tangerina - 750ml	Xarope Monin Tangerina	Insumos		0.75	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": false, "minimo": null}, "altoxv": {"ativo": false}}	81	\N	0
ddd20374-7a63-46b5-90fa-8451a67aa1cf	Xarope de Caramelo - 250ml	Xarope Monin Caramelo	Insumos		0.25	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": false}, "altoxv": {"ativo": false}}	78	\N	0
40805ae9-e353-42e2-a0ec-e633855c7342	Xarope de Caramelo - 750ml	Xarope Monin Caramelo	Insumos		0.75	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	83	\N	0
8b870df4-27c9-4443-a952-3dae37e3e963	Caixa Kraft p/ Porção Grande - c/ 25un		Insumos	Comercial Barbante e Papel	25	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	55	\N	0
02cfebe2-4de3-4c77-a73e-903b185d54a6	Saco de Lixo 20 Litros Preto Micra 4 - c/ 100un		Material de Limpeza	Super Brilho	100	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	84	\N	0
9be978f0-4961-40b6-b4eb-c75fe6798110	Papel Higiênico - FD - 12 Rolos/30mt		Material de Limpeza	Super Brilho	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	89	\N	0
04a5a69c-bedb-495f-bf98-9faf1291b284	Álcool em Gel 70% - 5 Litros		Material de Limpeza	Super Brilho	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	91	\N	0
b053e306-2a07-4a66-a8c9-e091785f7df4	Coca Cola Sem Açucar - Lata - (350ml)	Coca Cola Sem Açucar - Lata - (350ml)	Bebidas	Coca Cola	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	102	\N	0
8850838c-26df-4793-b742-75c6ae75a10f	Suco Del Valle Maracujá - Lata - (290ml)	Suco Del Valle Maracujá - Lata - (290ml)	Bebidas	Distribuidor de Bebidas	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	117	\N	0
cb1ea2a9-cabd-4354-9f27-4c87b93a23bd	Quiche de Alho Poró - 1un		Salgados	Cassinele	1	Unidade	\N	f	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": false}, "altoxv": {"ativo": false}}	32	\N	0
1deec24f-5074-421e-b791-8df4fc7dbc5c	Ki-Cascão Conny - c/ 120un	Cascão	Insumos	Marmikok	120	Caixa	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true, "minimo": 4, "desejado": 8}, "ahu": {"ativo": true, "minimo": 1, "desejado": 2}, "altoxv": {"ativo": true, "minimo": 1, "desejado": 2}}	3	\N	0
b625208d-0946-407f-aabd-fc2b2c736105	Tampa  p/ Copo Papel 270ml - 62mm - c/ 50un		Insumos	Sete Embalagens	50	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	44	\N	0
89608781-6cc9-4ee9-ac4f-cb2041a1cc68	Morango Bandeja - c/ 250gr	Morango	Insumos	Kalunga	0.25	kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": false}, "altoxv": {"ativo": false}}	128	\N	0
75f5aa3a-8c85-426e-a4b9-d3b64578519b	Quiche Lorraine - 1un		Salgados	Cassinele	1	Unidade	\N	f	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": false}, "altoxv": {"ativo": false}}	34	\N	0
81b9ed64-d226-44d7-810b-6f15b64535d8	Leite UHT Integral - 1kg	Leite UHT Integral	Insumos	Mercado	1	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	24	\N	0
c8132e9b-d800-488a-ace2-790da252b525	Pote Kraft 550ml - c/ 25un	Pote Kraft 550ml	Insumos	FNS Cups	25	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	7	\N	0
4dd5d67c-767c-42dc-abc9-9cd4539579c6	Pote Kraft 120ml - c/ 50un	Pote Kraft 120ml	Insumos	Nazapack	50	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true, "minimo": 20, "desejado": 50}, "ahu": {"ativo": true, "minimo": 2, "desejado": 4}, "altoxv": {"ativo": true, "minimo": 2, "desejado": 4}}	2	\N	0
2b89ed2e-7e42-4dbc-89ea-4e972e43f3fa	Pote 200ml Descartável - c/ 50un		Insumos	Marmikok	50	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	11	\N	0
a40de54b-d141-412d-83f5-8e0f1fc7102d	Copo Papel Preto Parede Simples 110ml - c/ 50un	Copo de Papel Preto Parede Simples 110ml	Insumos	Sete Embalagens	50	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	14	\N	0
bf54025c-d11a-4598-8a1e-ed2e8a5a17a8	Pote Kraft 80ml - c/ 50un	Pote Kraft 80ml	Insumos	Nazapack	50	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true, "minimo": 20, "desejado": 50}, "ahu": {"ativo": true, "minimo": 2, "desejado": 4}, "altoxv": {"ativo": true, "minimo": 2, "desejado": 4}}	1	\N	0
bca30d7c-bcbe-49ca-8c4b-1c9d44908351	Tampa p/ Pote 200ml - c/ 50un		Insumos	Marmikok	50	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	12	\N	0
3a1749e1-5b46-4f95-8ded-0a1d02608f09	Ki-Casquinha Conny - c/ 240un	Casquinha	Insumos	Marmikok	240	Caixa	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true, "minimo": 4, "desejado": 8}, "ahu": {"ativo": true, "minimo": 0, "desejado": 1}, "altoxv": {"ativo": true, "minimo": 0, "desejado": 1}}	4	\N	0
5bdb156e-ac02-4634-bf62-15455ab1eea3	Nutella Pote - 650gr	Nutella	Insumos	Santo Antônio	0.65	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	25	\N	0
521f2d74-463c-4737-bb85-c47d39e96845	Pázinha Curta Branca - c/ 500un	Pázinha Curta Branca	Insumos	Marmikok	500	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	9	\N	0
96abcb52-14df-4ad2-b433-2aee0669ee30	Saco de Lixo 40 Litros Preto Micra 4 - c/ 100un		Material de Limpeza	Super Brilho	100	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	85	\N	0
cb69c0c7-76b7-4215-a8ad-dbdeac02117a	Copo 300ml Descartável - c/ 100un		Insumos	Marmikok	100	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	13	\N	0
6079efab-6235-4c98-97aa-43417ea5e2d2	Xarope de Maça Verde - 250ml	Xarope Monin Maça Verde	Insumos		0.25	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	74	\N	0
82b1fb0f-7fce-4600-a9b0-14ccdc406a57	Tampa p/ Pote Kraft 550ml - c/ 25un	Tampa p/ Pote Kraft 550ml	Insumos	FNS Cups	25	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	8	\N	0
3c6b8682-0043-4b02-b2da-6c4ed5af0324	Guardanapo 20x20 - c/ 100un	Guardanapo 20x20	Insumos	Marmikok	100	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	10	\N	0
7bdea7fc-8203-48a3-83cd-7f8b2bf75004	Sanduíche de Parma - 1un		Salgados	Cassinele	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true, "minimo": 6, "desejado": 12}, "altoxv": {"ativo": true, "minimo": 6, "desejado": 12}}	31	\N	0
0475e15d-55ff-4030-afb5-1b5e68b585b0	Sanduíche de Mortadela - 1un		Salgados	Cassinele	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true, "minimo": 6, "desejado": 12}, "altoxv": {"ativo": true, "minimo": 6, "desejado": 12}}	30	\N	0
aeaef954-0c1f-4a0d-be7c-2013baecdf2d	Café em Grão - 1kg	Café em Grão	Insumos	Astoria	1	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	20	\N	0
d53928a4-d748-4e75-a4a0-0f86a74b9571	Cacau em pó 50% - 500gr (NESTLÉ) "mocha"		Insumos		0.5	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false, "minimo": null}, "ahu": {"ativo": true, "minimo": null}, "altoxv": {"ativo": true}}	23	\N	0
f1c79b09-1819-49b5-9a1f-8cd77b013be6	Chocolate Quente em Pó - 1kg	Chocolate Quente em Pó	Insumos	Net Coffe	1	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	22	\N	0
2b9e407a-5d77-476f-ade9-cd0c4cbd2bb7	Guardanapo Sache Delivery - c/ 1.000un		Insumos	Mercado Livre	1000	Unidade	\N	f	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	36	\N	0
9c4e5257-2455-43ff-aa09-0811390a02d2	Cappuccino em Pó - 1kg	Cappuccino em Pó	Insumos	Astoria	1	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	21	\N	0
a3f83a8d-f611-4a1c-955b-1ac615348b94	Guardanapo Interfolhado 10x20 ROSA - c/ 5.000un		Insumos	Marmikok	5000	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true, "desejado": null}, "altoxv": {"ativo": true}}	35	\N	0
daa9968f-370b-4c09-bc1e-b0a170f3142c	Pote de Isopor 120ml - c/ 20un		Insumos		20	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	39	\N	0
5c61e89e-5c83-4782-a6e9-5b33f492bb9a	Tampa p/ Pote 120ml - c/ 100un		Insumos		100	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	40	\N	0
a7c7aecc-e360-4afa-a3d7-eeafffd9248b	Plástico Filme 28cm x 100m	Plástico Filme	Insumos		1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	61	\N	0
1fca9f85-323c-4656-9b0a-a4e0cf74083e	Touca Descartável - c/ 100un		Insumos	Mercado Livre	100	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	62	\N	0
65c3990f-be54-4b38-adbe-f19cc8950013	Máscara Descartável - c/ 100un		Insumos	Mercado Livre	100	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	63	\N	0
0e526aad-5e3d-4d01-83c4-0cb754af9f33	Sachê de Açúcar		Insumos		1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	70	\N	0
96a03bd6-de22-4eda-99b0-68f2e7dd955c	Pote p/ Molho 60ml Galvanotek G697 - c/ 20un		Insumos	Armazem das Embalagens	20	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	42	\N	0
510e66ec-68bd-4c76-88dd-07537ad33418	Tampa p/ Copo Papel 110ml - c/ 50un		Insumos	Sete Embalagens	50	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	43	\N	0
9033a7e0-470a-4c37-bda0-7df170946057	Pote p/ Molho 30ml Galvanotek G695 - c/ 10un		Insumos	Armazem das Embalagens	10	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	41	\N	0
36f6247f-610f-4b12-b804-90b1eb419617	Canudo com Mexedor - c/ 100un	Canudo p/ Soda Italiana	Insumos		100	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	46	\N	0
eb9ed0b3-2065-4517-a827-7689183db366	Canudo Biodegradável - c/ 100un		Insumos	Marmikok	100	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	47	\N	0
be9f5716-b9f1-4aa6-ba5d-547815f09e61	Mechedor de Café Simples 11cm - c/ 500un		Insumos	Marmikok	500	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	48	\N	0
222d7863-b99f-4749-80fb-dd3f2bb7c28c	Faca Forte - c/ 50un (STRAWPLAST)		Insumos		50	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	50	\N	0
2a4a67f1-44b4-4970-b91f-e0cb757f3e71	Saco de Plástico p/ Talher 4cm x 23cm - c/ 1.000un		Insumos		1000	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	52	\N	0
80cdfb36-780a-46c8-854e-79ff04802ab2	Filtro de Papel p/ Café n102 - c/ 30un		Insumos		30	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	54	\N	0
ccaf6063-e307-4137-bf5f-ada8bac2926e	Embalagem de Cachorro Quente - c/ 100un		Insumos		100	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	56	\N	0
1a038e1e-65e5-4fa8-80ca-7fd2aa31b56f	Pote 100ml Descartável - c/ 100un		Insumos	Marmikok	100	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	38	\N	0
5daea43b-e00d-49ce-ace6-7bae2100ab9a	Álcool Líquido 70% - 1 Litro		Material de Limpeza		1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	98	\N	0
82fd5205-9fbf-4564-83df-6e16776c4718	Água Crystal Com Gás - Garrafa - (500ml)	Água Crystal Com Gás - Garrafa - (500ml)	Bebidas	Coca Cola	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	100	\N	0
e20ce8ae-29ff-4672-881a-c066aa9369d1	Xarope de Framboesa - 250ml	Xarope Monin Framboesa	Insumos		0.25	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	75	\N	0
da8554d4-b72e-4e8f-86cb-ba8d1c17c452	Xarope de Baunilha - 250ml	Xarope Monin Baunilha	Insumos		0.25	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": false}, "altoxv": {"ativo": false}}	77	\N	0
6e653ca6-0889-42d5-9b67-84e8565b67df	Schweppes Citrus - Lata - (350ml)	Schweppes Citrus - Lata - (350ml)	Bebidas	Distribuidor de Bebidas	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	103	\N	0
d6d28a8c-b6dd-435e-81df-5ba4c0b228db	Chá Matte Leao Guaraná Power Açai - Copo - (300ml)	Chá Matte Leao Guaraná Power Açai - Copo - (300ml)	Bebidas	Distribuidor de Bebidas	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	112	\N	0
55519e38-a952-4223-a0a9-4d36d53adb54	Bobina Maquininha		Insumos	Mercado Livre	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	68	\N	0
ccec7143-7d35-4dc8-9a71-d0a7b7868eab	Suco Del Valle Pêssego - Lata - (290ml)	Suco Del Valle Pêssego - Lata - (290ml)	Bebidas	Distribuidor de Bebidas	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	113	\N	0
397d3931-4847-4f37-b9d5-561901a20aa0	Durex		Insumos		1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	69	\N	0
2980bb3d-2d48-4576-9994-f920221a2561	Água Sanitária - 5 Litros		Material de Limpeza	Super Brilho	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": false}, "altoxv": {"ativo": false}}	96	\N	0
f048bde5-8f77-4969-9a21-658fc070c115	Abaixador de Língua Madeira c/ 100un  (THEOTO)		Insumos	Orto Curitiba	100	Unidade	\N	f	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	73	\N	0
7a77e18f-94b7-4efd-8f6e-80964703a15f	Suco Del Valle Uva - Lata - (290ml)	Suco Del Valle Uva - Lata - (290ml)	Bebidas	Distribuidor de Bebidas	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	114	\N	0
09ce4212-faa0-4db9-9b46-66fc8fc9568b	Sprite - Lata - (350ml)	Sprite - Lata - (350ml)	Bebidas	Distribuidor de Bebidas	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	108	\N	0
ab0eb23d-9995-4851-a934-ec1a7a541551	Sabão em Pó Omo - 2.2kg		Material de Limpeza	Super Brilho	2.2	kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": false}, "altoxv": {"ativo": false}}	97	\N	0
9e53ddd5-2168-411d-8c7b-03a419c1e158	Etiquetas Adesivas Brancas Grande - 50x30mm		Insumos	Marmikok	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	64	\N	0
67f01c59-ce5f-467e-8597-714719412b84	Coca Cola - Lata - (350ml)	Coca Cola - Lata - (350ml)	Bebidas	Coca Cola	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	101	\N	0
21174f2c-7831-440d-9f5e-daa81d6b94c0	Fanta Uva - Lata - (350ml)	Fanta Uva - Lata - (350ml)	Bebidas	Distribuidor de Bebidas	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	106	\N	0
9cc01971-1ad8-4011-851b-6ca6a97d6284	Água Crystal - Garrafa - (500ml)	Água Crystal - Garrafa - (500ml)	Bebidas	Coca Cola	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	99	\N	0
24807ae6-f46b-48a2-a8c7-def2e8f142fd	Chá Matte Leao - Copo - (300ml)	Chá Matte Leao - Copo - (300ml)	Bebidas	Distribuidor de Bebidas	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	109	\N	0
2a1e3e9d-662b-439e-a8a6-ee7243b479cb	Chá Matte Leao Limão - Copo - (300ml)	Chá Matte Leao Limão - Copo - (300ml)	Bebidas	Distribuidor de Bebidas	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	110	\N	0
03b764ae-765a-45cd-b897-da245f712055	Saco de Lixo 60 Litros Preto Micra 8 - c/ 100un		Material de Limpeza	Super Brilho	100	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	86	\N	0
2cfc2c11-0a9a-477e-b284-cfea61d29148	Detergente Neutro - 500ml		Material de Limpeza	Super Brilho	1	Unidade	\N	f	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": false}, "altoxv": {"ativo": false}}	93	\N	0
9f923a19-b96c-4dc1-88a7-6241c9c2574b	Suco Del Valle Limonada Pink - Lata - (290ml)	Suco Del Valle Limonada Pink - Lata - (290ml)	Bebidas	Distribuidor de Bebidas	1	Unidade	\N	f	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": false}, "altoxv": {"ativo": false}}	119	\N	0
57783cd8-cc42-42d0-bf7f-159ae6900038	Suco Del Valle Limonada Classic - Lata - (290ml)	Suco Del Valle Limonada Classic - Lata - (290ml)	Bebidas	Distribuidor de Bebidas	1	Unidade	\N	f	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": false}, "altoxv": {"ativo": false}}	118	\N	0
f3c6a7c7-ef37-4e73-8627-760439e90be7	Xarope de Maple Syrup - 816ml	Xarope de Maple Syrup	Insumos	Mercado Livre	0.816	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	122	\N	0
01659df6-43fe-4ced-90cd-25ab1f9b74cf	Leite Condensado - 395gr	Leite Condensado	Insumos		0.395	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	123	\N	0
49438d71-d79a-4758-b5a8-d6a08dce32a4	Chá Matte Leao Guaraná Power - Copo - (300ml)	Chá Matte Leao Guaraná Power - Copo - (300ml)	Bebidas	Distribuidor de Bebidas	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	111	\N	0
a1b5529d-9572-4c4f-a2bd-b1b2b79bb7f7	Veja Multi Uso 500ml		Material de Limpeza	Super Brilho	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	88	\N	0
6c1388ea-5eda-4f92-804d-9dc6f4452579	Álcool Líquido 70% - 5 Litros		Material de Limpeza	Super Brilho	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	90	\N	0
57f021fd-13b0-4484-ab86-79782ef938c0	Suco Del Valle Goiaba - Lata - (290ml)	Suco Del Valle Goiaba - Lata - (290ml)	Bebidas	Distribuidor de Bebidas	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	115	\N	0
efdfb241-7bdb-4f6d-ad11-9fdd26aade7c	Detergente Neutro - 5 Litros		Material de Limpeza	Super Brilho	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	92	\N	0
3e5869da-fdde-4b50-93b0-a04d2eb965dd	Esponja Multiuso Dupla Face AM/VD		Material de Limpeza	Super Brilho	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	94	\N	0
2f3eba38-9e08-4fe3-b624-84170b7f5aa1	Papel Interfolhado 20x20 Branco 2 Dobras - c/ 1.000un		Insumos	Marmikok	1000	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	37	\N	0
a5f552f1-4392-4c53-977f-08739186fcb5	Pano Multiuso - 28cm x 25mt		Material de Limpeza	Super Brilho	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	95	\N	0
47709673-7e0c-4620-9562-4d1ea2315217	Suco Del Valle Manga - Lata - (290ml)	Suco Del Valle Manga - Lata - (290ml)	Bebidas	Distribuidor de Bebidas	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	116	\N	0
dd0a3e04-c365-45f3-b6a8-f7fb08de6e4f	Garfo Forte - c/ 50un (STRAWPLAST)		Insumos		50	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	49	\N	0
11ef6eff-1063-4529-9c18-682b428908ed	Paçoquita Embalada - 1un	Paçoca Unidade	Insumos		1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	125	\N	0
1b7ba191-0ef1-4f98-80e7-e29266fd64e2	Saco de Papel p/ Talher 6cm x 26cm - c/ 500un		Insumos		500	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	53	\N	0
493d4e21-eaa5-4711-ae8b-b73fad3822de	Mini Óreo - 35gr	Mini Óreo - 35gr - Unidade	Insumos		1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	126	\N	0
f8c8e834-9063-4a25-8925-12db6592d203	Banana	Banana	Insumos		1	Kg	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": false}, "altoxv": {"ativo": false}}	129	\N	0
16f930db-011d-40e0-ac84-1949c29821fe	Saco Kraft Delivery Liso SOS 15kg - c/ 100un		Insumos	Sete Embalagens	100	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": true}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	58	\N	0
5db6171c-d897-4894-af28-bbf63adad316	Fanta Laranja - Lata - (350ml)	Fanta Laranja - Lata - (350ml)	Bebidas	Distribuidor de Bebidas	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	105	\N	0
424d80dc-6975-4812-9571-b3baadd2db31	Fanta Guaraná - Lata - (350ml)	Fanta Guaraná - Lata - (350ml)	Bebidas	Distribuidor de Bebidas	1	Unidade	\N	t	2026-05-30 14:30:57.774522+00	{"mh": {"ativo": false}, "ahu": {"ativo": true}, "altoxv": {"ativo": true}}	107	\N	0
\.


--
-- Data for Name: cadastro_produtos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."cadastro_produtos" ("id", "nome", "categoria", "ativo", "created_at", "preco_venda", "unidade_venda", "ordem", "metodo_preparo") FROM stdin;
0a87d61a-0a52-43f6-9e63-bc7e9f1f719d	Pequeno ( 1 sabor )	Gelato	t	2026-05-31 14:25:53.234013+00	16	Unidade	0	\N
6ed28a48-b705-4067-a6a9-d10be587f0a7	Grande ( até 3 sabores )	Gelato	t	2026-05-31 16:29:16.075485+00	23	Unidade	2	\N
b890578d-894b-41ea-8aeb-3fa0b0d94fed	Médio ( até 2 sabores )	Gelato	t	2026-05-31 16:28:04.554471+00	19	Unidade	1	\N
de6b07a4-0339-4f12-95de-d76430659fe1	Produto Teste	teste	t	2026-05-31 18:19:22.69862+00	120	Unidade	3	teste\n1. faça isso\n2, faça aquilo\nnunc se esquecer do item 3\n\nE sempre avisar\nsem mais
d7add5c4-088c-47bb-8136-2b95c5b8249e	Produto Teste Pequeno	\N	t	2026-05-31 19:07:31.718763+00	14.99	Unidade	4	\N
\.


--
-- Data for Name: cardsahu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."cardsahu" ("id", "title", "status", "production_date", "entry_date", "created_by", "last_edited_by", "position", "created_at", "exit_date", "updated_at", "history") FROM stdin;
dcb615df-01e4-424b-b9bb-4f5613dca1d0	Banoffe	excluidos	2026-04-22	2026-05-22	sthefani.alves.def@gmail.com	endrywgabrielx@gmail.com	0	2026-05-22 16:47:55.097+00	2026-05-24	2026-05-26 22:06:23.903+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T16:47:55.097Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-22T16:47:59.956Z"}, {"user": "endrywgabrielx@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-24T21:40:59.970Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-26T22:06:23.903Z"}]
0630d9f7-a6d3-4152-bb85-3550cf2dfdcd	Morango	vitrine-atual	2026-04-18	2026-05-22	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	1	2026-05-22 16:55:33.434+00	\N	2026-05-22 16:59:55.202+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T16:55:33.434Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-22T16:59:55.202Z"}]
fa9cb759-63d2-4446-bb49-cdef4d02d598	Abacaxi com Hortelã e Gengibre	excluidos	2026-04-18	2026-05-22	sthefani.alves.def@gmail.com	endrywgabrielx@gmail.com	2	2026-05-22 16:55:47.442+00	2026-05-27	2026-05-28 12:54:29.995+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T16:55:47.442Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-22T16:59:53.550Z"}, {"user": "endrywgabrielx@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-27T19:19:39.764Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-28T12:54:29.995Z"}]
3fb38d49-0d94-422d-91df-f592487ee9b8	Don Vitto	excluidos	2026-04-23	2026-05-22	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	3	2026-05-22 16:56:00.523+00	2026-05-24	2026-05-26 22:06:23.903+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T16:56:00.523Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-22T16:59:56.477Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-24T19:36:41.257Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-26T22:06:23.903Z"}]
df20554f-4f8a-4305-9618-f35433cbee78	Coco Diet	excluidos	2026-04-23	2026-05-22	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	4	2026-05-22 16:56:37.376+00	2026-05-26	2026-05-26 22:06:23.903+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T16:56:37.376Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-22T17:00:12.235Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-26T21:44:52.955Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-26T22:06:23.903Z"}]
5e8f3e88-5b0b-4608-8394-ecb1ce536ab1	Iogurte com Amarena	cubas-saidas-vitrine	2026-04-22	2026-05-27	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	16	2026-05-22 17:10:09.964+00	2026-05-31	2026-05-31 18:20:00.911+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:10:09.964Z"}, {"user": "endrywgabrielx@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-27T15:02:28.174Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-31T18:20:00.911Z"}]
c3d4a3d6-44eb-416a-ab37-5be78a846a69	Doce de Leite	excluidos	2026-04-29	2026-05-22	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	5	2026-05-22 16:56:55.32+00	2026-05-23	2026-05-24 13:37:05.102+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T16:56:55.320Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-22T17:00:19.322Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-23T21:35:40.226Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-24T13:37:05.105Z"}]
523fb24a-9da4-41fa-b850-d34d6519d382	Leite Condensado com Morango	excluidos	2026-04-24	2026-05-22	sthefani.alves.def@gmail.com	endrywgabrielx@gmail.com	6	2026-05-22 16:57:11.695+00	2026-05-27	2026-05-28 12:54:29.995+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T16:57:11.695Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-22T17:00:16.114Z"}, {"user": "endrywgabrielx@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-27T19:19:27.256Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-28T12:54:29.995Z"}]
3e88bb78-2fc5-40d6-aaef-db20ce4a3c3b	Café	cubas-saidas-vitrine	2026-04-24	2026-05-22	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	7	2026-05-22 16:57:23.652+00	2026-05-31	2026-05-31 17:52:00.531+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T16:57:23.652Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-22T17:00:17.182Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-31T17:52:00.531Z"}]
1862b43a-7ac5-43d3-a0d2-2c4c5492b7e1	Iogurte com Laranja	excluidos	2026-05-08	2026-05-22	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	12	2026-05-22 16:59:07.626+00	2026-05-28	2026-05-29 17:10:11.681+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T16:59:07.626Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-22T17:00:22.022Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-28T22:01:22.240Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-29T17:10:11.685Z"}]
63ab3634-36b5-4a30-b234-99c5d9ec9c19	Chocolate	excluidos	2026-05-08	2026-05-24	sthefani.alves.def@gmail.com	endrywgabrielx@gmail.com	17	2026-05-22 17:10:25.393+00	2026-05-27	2026-05-28 12:54:29.995+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:10:25.393Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-24T19:10:46.277Z"}, {"user": "endrywgabrielx@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-27T20:30:16.720Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-28T12:54:29.995Z"}]
bca06fee-51a1-48b7-8b60-be6c351d7838	Cheesecake de Frutas Vermelhas	quebras	2026-05-12	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	28	2026-05-22 17:14:57.101+00	\N	2026-05-22 17:14:57.101+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-22T17:14:57.101Z"}]
6cd071c1-361a-463f-8a24-7cf273d7be56	Maracujá	excluidos	2026-04-23	2026-05-22	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	8	2026-05-22 16:57:46.486+00	2026-05-30	2026-05-31 16:25:16.269+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T16:57:46.486Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-22T17:00:13.544Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-30T20:34:49.870Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-31T16:25:16.269Z"}]
8ba411c2-ef99-4ffd-b23d-c1d44967aa22	Baunilha	excluidos	2026-04-23	2026-05-22	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	9	2026-05-22 16:58:21.195+00	2026-05-25	2026-05-26 22:06:23.903+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T16:58:21.195Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-22T17:00:14.817Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-25T21:48:21.808Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-26T22:06:23.903Z"}]
85bddf3d-c9c1-4d9a-8017-fa164305b0e9	Frutas Vermelhas	cubas-saidas-vitrine	2026-04-25	2026-05-22	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	10	2026-05-22 16:58:30.008+00	2026-05-31	2026-05-31 22:02:31.147+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T16:58:30.008Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-22T17:00:18.263Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-31T22:02:31.147Z"}]
bf79e58f-2b5c-4b15-9c56-e8c840f41e4c	Chocolate	excluidos	2026-05-29	2026-05-22	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	11	2026-05-22 16:58:47.564+00	2026-05-24	2026-05-26 22:06:23.903+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T16:58:47.564Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-22T17:00:07.614Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-24T19:10:35.649Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-26T22:06:23.903Z"}]
2418073c-5da4-42cf-95e8-8ab822ded183	Leite Ninho com Nutella	excluidos	2026-05-08	2026-05-22	sthefani.alves.def@gmail.com	endrywgabrielx@gmail.com	13	2026-05-22 16:59:18.271+00	2026-05-27	2026-05-28 12:54:29.995+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T16:59:18.271Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-22T17:00:23.081Z"}, {"user": "endrywgabrielx@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-27T21:57:33.364Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-28T12:54:29.995Z"}]
1f83e873-063e-4da0-abd2-db712c65aa10	Romeu e Julieta	vitrine-atual	2026-05-30	2026-05-22	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	14	2026-05-22 16:59:38.937+00	\N	2026-05-22 17:00:09.126+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T16:59:38.937Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-22T17:00:09.126Z"}]
88c7a41c-f466-4469-8186-e9fbfcd00f0f	Abacaxi com Hortelã e Gengibre	vitrine-atual	2026-04-23	2026-05-27	sthefani.alves.def@gmail.com	endrywgabrielx@gmail.com	18	2026-05-22 17:10:41.434+00	\N	2026-05-27 19:19:50.999+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:10:41.434Z"}, {"user": "endrywgabrielx@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-27T19:19:50.999Z"}]
375da387-834f-4075-a511-1509356f626d	Frutas Vermelhas	vitrine-atual	2026-05-07	2026-05-31	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	19	2026-05-22 17:10:55.27+00	\N	2026-05-31 22:03:07.621+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:10:55.270Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-31T22:03:07.621Z"}]
c70e58f9-fec1-4420-bc73-2b76c00460ee	Maracujá	freezer-estoque	2026-04-23	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	20	2026-05-22 17:11:06.764+00	\N	2026-05-22 17:11:06.764+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:11:06.764Z"}]
2993a02e-3582-43f9-b4f3-41c8ba8cfaf2	Torta Belga	excluidos	2026-05-08	2026-05-24	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	21	2026-05-22 17:11:31.263+00	2026-05-30	2026-05-31 16:25:16.269+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:11:31.263Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-24T19:38:18.359Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-30T21:50:48.641Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-31T16:25:16.269Z"}]
dca457c4-90b0-48c7-bb7a-e5e8cfef499c	Baunilha	cubas-saidas-vitrine	2026-04-30	2026-05-25	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	22	2026-05-22 17:11:38.854+00	2026-05-31	2026-05-31 22:02:27.163+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:11:38.854Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-25T21:48:27.689Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-31T22:02:27.163Z"}]
6b7895c5-adb5-4636-8ba1-c4358d58856a	Stracciatella	vitrine-atual	2026-04-06	2026-05-25	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	23	2026-05-22 17:11:56.3+00	\N	2026-05-25 14:42:00.947+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:11:56.300Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-25T14:42:00.948Z"}]
07ec5e9a-a4f6-47ca-858e-69bdc91ee217	Hortelã com Chocolate	vitrine-atual	2026-05-14	2026-05-29	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	24	2026-05-22 17:12:20.328+00	\N	2026-05-29 14:27:53.361+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:12:20.328Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-29T14:27:53.361Z"}]
aeb08e86-1a68-4295-81ad-8eb39dd960e3	Banana Nevada	vitrine-atual	2026-04-29	2026-05-27	sthefani.alves.def@gmail.com	endrywgabrielx@gmail.com	25	2026-05-22 17:12:33.357+00	\N	2026-05-27 19:21:55.15+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:12:33.357Z"}, {"user": "endrywgabrielx@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-27T19:21:55.151Z"}]
3a9dec92-2819-4f2c-af55-febf09be6d1f	Pistache	excluidos	2026-05-17	2026-05-24	sthefani.alves.def@gmail.com	endrywgabrielx@gmail.com	27	2026-05-22 17:13:22.851+00	2026-05-30	2026-05-31 16:25:16.269+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:13:22.851Z"}, {"user": "endrywgabrielx@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-24T17:19:15.350Z"}, {"user": "endrywgabrielx@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-30T20:25:30.498Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-31T16:25:16.269Z"}]
abaa56af-6dde-4ddd-a469-2a6c1b25aa6e	Paçoca com Chocolate	quebras	2026-05-21	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	29	2026-05-22 17:23:10.376+00	\N	2026-05-22 17:23:10.376+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-22T17:23:10.376Z"}]
581168d6-19da-4eac-b7c0-877bb4bfe2b2	Chocolate Branco com Maracujá	quebras	2026-04-25	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	30	2026-05-22 17:25:17.065+00	\N	2026-05-22 17:25:17.065+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-22T17:25:17.065Z"}]
18938469-4670-4b15-b64a-9600954f605f	Kinder	quebras	2026-04-26	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	33	2026-05-22 17:26:03.552+00	\N	2026-05-22 17:26:03.552+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-22T17:26:03.552Z"}]
b9929573-ba13-4d24-b989-f2c70ec7e6ec	Lemon Pie	quebras	2026-03-29	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	36	2026-05-22 17:30:41.678+00	\N	2026-05-22 17:30:41.678+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-22T17:30:41.678Z"}]
618a7a3f-10ff-431f-9849-946f475a00cf	Lemon Pie	quebras	2026-03-07	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	38	2026-05-22 17:31:32.463+00	\N	2026-05-22 17:31:32.463+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-22T17:31:32.463Z"}]
09afb921-a9cd-464e-ad46-deca86bb6ad1	Limão Tahiti	quebras	2026-05-07	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	39	2026-05-22 17:31:58.14+00	\N	2026-05-22 17:31:58.14+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-22T17:31:58.140Z"}]
48f43935-964b-42c8-bf7c-10bacde50ca7	Macadâmia	quebras	2026-04-19	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	41	2026-05-22 17:32:37.702+00	\N	2026-05-22 17:32:37.703+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-22T17:32:37.703Z"}]
6a8a65f7-8945-422e-83ab-410a9270fd8f	Doce de Leite	quebras	2026-05-23	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	42	2026-05-23 21:35:50.841+00	\N	2026-05-23 21:35:50.841+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine)", "timestamp": "2026-05-23T21:35:50.841Z"}]
4c722b83-9059-4d8e-ac02-6e1a0f2001c1	Leite Condensado com Morango	vitrine-atual	2026-05-08	2026-05-29	endrywgabrielx@gmail.com	sthefani.alves.def@gmail.com	51	2026-05-24 20:03:44.493+00	\N	2026-05-29 14:27:08.257+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-24T20:03:44.493Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-29T14:27:08.257Z"}]
ba788567-d949-4ffc-aaf2-17db46eaa54f	Torta Belga	quebras	2026-05-30	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	75	2026-05-30 21:50:49.691+00	\N	2026-05-30 21:50:49.691+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine)", "timestamp": "2026-05-30T21:50:49.691Z"}]
f6a5201f-b573-4db9-9ef2-75a49a8ac39b	Hortelã com Chocolate	quebras	2026-04-25	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	31	2026-05-22 17:25:38.848+00	\N	2026-05-22 17:25:38.848+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-22T17:25:38.848Z"}]
e7a4ec87-0dff-4bdc-a45e-e4a6f8066064	Kinder	quebras	2026-04-26	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	32	2026-05-22 17:25:52.766+00	\N	2026-05-22 17:25:52.766+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-22T17:25:52.766Z"}]
9f296764-5078-4535-a3d3-01d9978fa5b3	Limão Tahiti	quebras	2026-05-07	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	40	2026-05-22 17:32:17.918+00	\N	2026-05-22 17:32:17.918+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-22T17:32:17.918Z"}]
84f3ec80-3019-45d5-99f3-5340ee0d7787	Don Vitto	quebras	2026-05-24	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	43	2026-05-24 19:36:48.017+00	\N	2026-05-24 19:36:48.017+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine)", "timestamp": "2026-05-24T19:36:48.017Z"}]
75766c79-8533-4959-b99a-6032382952ec	Don Vitto	freezer-estoque	2026-05-20	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	44	2026-05-24 19:40:12.976+00	\N	2026-05-24 19:40:12.976+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-24T19:40:12.976Z"}]
64495f63-66c8-403e-be92-598975e0f085	Dolce Mocha	freezer-estoque	2026-05-20	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	45	2026-05-24 19:40:28.178+00	\N	2026-05-24 19:40:28.178+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-24T19:40:28.178Z"}]
a49797ae-9698-441c-9899-1731572a8fd6	Paçoca com Chocolate	freezer-estoque	2026-05-15	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	46	2026-05-24 19:40:44.61+00	\N	2026-05-24 19:40:44.61+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-24T19:40:44.610Z"}]
63839049-8d7e-41fe-91e2-8f6201b9e3b2	Danoninho	freezer-estoque	2026-05-21	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	47	2026-05-24 19:41:01.543+00	\N	2026-05-24 19:41:01.543+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-24T19:41:01.543Z"}]
270f37ba-1863-4466-a7b3-f03103372b7d	Milho Verde	vitrine-atual	2026-04-24	2026-05-28	endrywgabrielx@gmail.com	sthefani.alves.def@gmail.com	48	2026-05-24 20:02:49.564+00	\N	2026-05-28 14:44:52.695+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-24T20:02:49.564Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-28T14:44:52.695Z"}]
b7a45fb5-20c2-4de5-bf40-7e3ca3fb76c6	Baunilha	vitrine-atual	2026-04-30	2026-05-31	endrywgabrielx@gmail.com	sthefani.alves.def@gmail.com	49	2026-05-24 20:03:13.435+00	\N	2026-05-31 22:03:04.021+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-24T20:03:13.435Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-31T22:03:04.021Z"}]
a3f5dc07-4a5c-41ac-8124-0522a7e88217	Chocolate	cubas-saidas-vitrine	2026-05-21	2026-05-27	endrywgabrielx@gmail.com	sthefani.alves.def@gmail.com	50	2026-05-24 20:03:26.838+00	2026-05-31	2026-05-31 22:02:18.137+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-24T20:03:26.838Z"}, {"user": "endrywgabrielx@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-27T20:30:27.154Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-31T22:02:18.137Z"}]
a27f0f84-60ce-4920-98e3-79af98351a1e	Caramelo Salgado	excluidos	2026-04-29	2026-05-22	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	15	2026-05-22 16:59:48.456+00	2026-05-28	2026-05-29 17:10:11.685+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T16:59:48.456Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-22T17:00:20.713Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-28T21:30:02.432Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-29T17:10:11.685Z"}]
454b4de9-e178-4e30-93c4-4bba05a5c046	Coco Diet	vitrine-atual	2026-04-23	2026-05-30	sthefani.alves.def@gmail.com	endrywgabrielx@gmail.com	26	2026-05-22 17:12:58.082+00	\N	2026-05-30 20:25:46.136+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:12:58.082Z"}, {"user": "endrywgabrielx@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-30T20:25:46.136Z"}]
d7baf466-fa3d-4361-b1e2-e7439e54557a	Lemon Pie	quebras	2026-04-25	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	34	2026-05-22 17:26:18.964+00	\N	2026-05-22 17:26:18.964+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-22T17:26:18.964Z"}]
55e4baa9-abfc-418b-b91b-c660a9b393db	Danoninho	quebras	2026-03-28	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	35	2026-05-22 17:30:10.004+00	\N	2026-05-22 17:30:10.004+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-22T17:30:10.004Z"}]
3fa11edf-2f5d-442e-a7f7-1f26b58e841f	Lemon Pie	quebras	2026-04-09	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	37	2026-05-22 17:30:57.049+00	\N	2026-05-22 17:30:57.049+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-22T17:30:57.049Z"}]
b5767b6d-4d25-49bf-bcbb-f0dd1b5e8dec	Banoffe	quebras	2026-05-24	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	53	2026-05-24 21:41:02.971+00	\N	2026-05-24 21:41:02.971+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine - Item 2 de 2)", "timestamp": "2026-05-24T21:41:02.971Z"}]
956c64d0-bcf8-40e9-ba8e-1b1cadd31cf5	Coco Diet	quebras	2026-05-26	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	54	2026-05-26 21:44:54.779+00	\N	2026-05-26 21:44:54.779+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine)", "timestamp": "2026-05-26T21:44:54.779Z"}]
4533dd54-550d-43fc-bd57-7a4b98d7ce4f	Leite Ninho com Nutella	quebras	2026-05-27	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	55	2026-05-27 21:57:34.361+00	\N	2026-05-27 21:57:34.361+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine)", "timestamp": "2026-05-27T21:57:34.361Z"}]
67726240-0e90-4549-9f9d-86ad870137bd	Caramelo Salgado	quebras	2026-05-28	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	56	2026-05-28 21:30:03.545+00	\N	2026-05-28 21:30:03.545+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine - Item 1 de 2)", "timestamp": "2026-05-28T21:30:03.545Z"}]
c2aef91c-f928-4ccc-9205-fcdb151c3451	Caramelo Salgado	quebras	2026-05-28	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	57	2026-05-28 21:30:03.545+00	\N	2026-05-28 21:30:03.545+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine - Item 2 de 2)", "timestamp": "2026-05-28T21:30:03.545Z"}]
dad7652f-0fc5-4dd6-8c9a-2e6c950f1d31	Iogurte com Laranja	quebras	2026-05-28	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	58	2026-05-28 22:01:26.023+00	\N	2026-05-28 22:01:26.023+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine)", "timestamp": "2026-05-28T22:01:26.023Z"}]
87521160-9658-4dee-bc61-89c72a73eb13	Torta Belga	vitrine-atual	2026-05-13	2026-05-31	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	59	2026-05-29 16:10:35.814+00	\N	2026-05-31 22:02:53.009+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-29T16:10:35.814Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-31T22:02:53.009Z"}]
1c3d8d81-25b5-466a-9fb0-fd25342b13d4	Abacaxi com Hortelã e Gengibre	freezer-estoque	2026-05-07	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	63	2026-05-29 16:11:22.695+00	\N	2026-05-29 16:11:22.695+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-29T16:11:22.695Z"}]
ccb3102b-8e00-4e54-ae91-0479de2e5347	Doce de Leite	freezer-estoque	2026-05-15	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	64	2026-05-29 16:11:36.189+00	\N	2026-05-29 16:11:36.19+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-29T16:11:36.190Z"}]
32427316-3d4f-4a7b-bed1-b69815fafc03	Banoffe	freezer-estoque	2026-05-28	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	65	2026-05-29 16:11:44.427+00	\N	2026-05-29 16:11:44.427+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-29T16:11:44.427Z"}]
645efc74-b447-4a41-bb09-e82f1ca1fd50	Cheesecake de Frutas Vermelhas	freezer-estoque	2026-04-30	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	66	2026-05-29 16:12:49.216+00	\N	2026-05-29 16:12:49.216+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-29T16:12:49.216Z"}]
fe4c27de-21ac-41af-8f4a-81facc23d1d2	Chocolate	cubas-saidas-vitrine	2026-05-21	2026-05-31	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	67	2026-05-29 16:13:11.492+00	2026-05-31	2026-05-31 22:03:16.977+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-29T16:13:11.492Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-31T22:02:57.717Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-31T22:03:16.977Z"}]
c81c7c89-14db-4b19-8cec-2f497a4d4614	Chocolate	vitrine-atual	2026-05-21	2026-05-31	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	68	2026-05-29 16:13:33.119+00	\N	2026-05-31 22:03:22.439+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-29T16:13:33.119Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-31T22:03:22.439Z"}]
9801fb76-0242-45de-b4ce-62648e278832	Baunilha	freezer-estoque	2026-04-30	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	69	2026-05-29 16:13:42.866+00	\N	2026-05-29 16:13:42.866+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-29T16:13:42.866Z"}]
a1e9f7bd-3da5-4578-bd17-d559b9b46b93	Coco com Doce de Leite	freezer-estoque	2026-03-25	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	70	2026-05-29 16:20:01.797+00	\N	2026-05-29 16:20:01.797+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-29T16:20:01.797Z"}]
415aa9e2-7fb1-4530-b61b-dc77d02ede83	Pistache	cubas-saidas-vitrine	2026-05-29	2026-05-31	endrywgabrielx@gmail.com	sthefani.alves.def@gmail.com	71	2026-05-30 17:31:04.334+00	2026-05-31	2026-05-31 22:02:36.301+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-30T17:31:04.334Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-31T15:49:23.415Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-31T22:02:36.301Z"}]
d90cb759-322a-4c9c-86d9-355bc8eb6606	Iogurte com Amarena	freezer-estoque	2026-05-20	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	60	2026-05-29 16:10:54.744+00	\N	2026-05-29 16:10:54.744+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-29T16:10:54.744Z"}]
e24ab876-4d54-4b05-9a6e-852d59c1e0f7	Leite Ninho com Nutella	vitrine-atual	2026-05-13	2026-05-31	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	61	2026-05-29 16:11:03.274+00	\N	2026-05-31 17:56:38.054+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-29T16:11:03.274Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-31T17:56:38.054Z"}]
77865def-96c5-4b54-beef-92e6c2ead8c5	Morango	freezer-estoque	2026-05-07	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	62	2026-05-29 16:11:16.95+00	\N	2026-05-29 16:11:16.95+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-29T16:11:16.950Z"}]
09c5f822-5f34-4acc-a62b-ef87c7b02fb5	Limão Tahiti	vitrine-atual	2026-04-23	2026-05-30	endrywgabrielx@gmail.com	sthefani.alves.def@gmail.com	72	2026-05-30 17:31:25.686+00	\N	2026-05-30 20:34:58.378+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-30T17:31:25.686Z"}, {"user": "sthefani.alves.def@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-30T20:34:58.378Z"}]
7fdf7577-0186-4a29-9c44-946a161c031d	Maracujá	quebras	2026-05-30	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	73	2026-05-30 20:34:55.778+00	\N	2026-05-30 20:34:55.778+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine - Item 1 de 2)", "timestamp": "2026-05-30T20:34:55.778Z"}]
2bf5ea4a-6bfb-4b51-8f96-6f6dc697a554	Maracujá	quebras	2026-05-30	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	74	2026-05-30 20:34:55.778+00	\N	2026-05-30 20:34:55.778+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine - Item 2 de 2)", "timestamp": "2026-05-30T20:34:55.778Z"}]
36ff63ef-2c14-4153-b921-85350120d837	Café	quebras	2026-05-31	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	76	2026-05-31 17:52:01.922+00	\N	2026-05-31 17:52:01.922+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine)", "timestamp": "2026-05-31T17:52:01.922Z"}]
8cc9d597-5573-4c86-b7d1-42b5852b7873	Pistache	quebras	2026-05-31	\N	sthefani.alves.def@gmail.com	sthefani.alves.def@gmail.com	77	2026-05-31 22:02:38.048+00	\N	2026-05-31 22:02:38.048+00	[{"user": "sthefani.alves.def@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine)", "timestamp": "2026-05-31T22:02:38.048Z"}]
edbcca13-c9a2-40b5-9d26-b170b66c632a	Banoffe	quebras	2026-05-24	\N	endrywgabrielx@gmail.com	endrywgabrielx@gmail.com	52	2026-05-24 21:41:02.971+00	\N	2026-05-24 21:41:02.971+00	[{"user": "endrywgabrielx@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine - Item 1 de 2)", "timestamp": "2026-05-24T21:41:02.971Z"}]
\.


--
-- Data for Name: cardsaltoxv; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."cardsaltoxv" ("id", "title", "status", "production_date", "entry_date", "created_by", "last_edited_by", "position", "created_at", "exit_date", "updated_at", "history") FROM stdin;
58180ade-4b80-48d3-b1e0-8dc4af41fb45	Frutas Vermelhas	excluidos	2026-04-25	2026-04-30	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	18	2026-04-29 16:40:23.976+00	2026-05-20	2026-05-21 13:13:25.739+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T16:40:23.976Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Movido para Vitrine", "timestamp": "2026-04-29T16:40:33.861Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-04-29T22:05:02.497Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Vitrine Atual", "timestamp": "2026-04-29T22:05:07.048Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-04-30T14:19:06.150Z"}, {"user": "henocera@gmail.com", "action": "Arquivo → Vitrine Atual", "timestamp": "2026-04-30T19:28:49.423Z"}, {"user": "henocera@gmail.com", "action": "Data de saída removida", "timestamp": "2026-04-30T20:17:49.961Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-20T14:39:01.329Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-21T13:13:25.745Z"}]
c430d1d3-6b32-4322-9c69-6502378a31b3	Iogurte com Laranja	excluidos	2026-04-30	2026-05-07	amandacorte053@gmail.com	amandacorte053@gmail.com	22	2026-05-01 16:30:41.028+00	2026-05-22	2026-05-25 20:11:03.429+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-01T16:30:41.028Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-07T21:08:52.458Z"}, {"user": "amandacorte053@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-22T20:35:53.546Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-25T20:11:03.429Z"}]
62b4a497-7a79-41e4-997e-b8219526f240	Doce de Leite	excluidos	2026-04-29	2026-05-07	amandacorte053@gmail.com	cassiafernanda344@gmail.com	23	2026-05-01 16:30:55.522+00	2026-05-16	2026-05-17 15:33:01.176+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-01T16:30:55.522Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-07T21:08:59.037Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-16T20:35:11.996Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-17T15:33:01.176Z"}]
7e24d33a-e289-4134-8ccd-992575dab014	Chocolate	excluidos	2026-04-29	2026-05-06	amandacorte053@gmail.com	cassiafernanda344@gmail.com	24	2026-05-01 16:31:35.468+00	2026-05-10	2026-05-11 00:25:57.207+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-01T16:31:35.468Z"}, {"user": "amandacorte053@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-06T14:52:18.056Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-10T14:47:54.391Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-11T00:25:57.207Z"}]
5ea6048d-d957-4ae0-a475-03e812a7cad3	Café	quebras	2026-04-22	\N	henocera@gmail.com	henocera@gmail.com	56	2026-05-18 19:37:31.681+00	\N	2026-05-18 19:37:31.681+00	[{"user": "henocera@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-18T19:37:31.681Z"}]
43e1bc98-fd92-4b7c-a97b-b0a0c7eff065	Leite Ninho com Nutella	excluidos	2026-04-22	2026-05-01	cassiafernanda344@gmail.com	amandacorte053@gmail.com	0	2026-04-29 16:20:26.438+00	2026-05-06	2026-05-08 12:34:27.805+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T16:20:26.438Z"}, {"user": "henocera@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-01T19:55:18.970Z"}, {"user": "henocera@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-01T21:07:32.416Z"}, {"user": "henocera@gmail.com", "action": "Arquivo → Vitrine Atual", "timestamp": "2026-05-01T21:07:36.704Z"}, {"user": "amandacorte053@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-06T14:54:41.976Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-08T12:34:27.808Z"}]
7856c602-e739-4c59-b9ca-66f40cab64f3	Dolce Mocha	excluidos	2026-04-17	2026-05-01	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	1	2026-04-29 16:21:50.518+00	2026-05-07	2026-05-08 12:34:27.808+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T16:21:50.518Z"}, {"user": "henocera@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-01T19:55:17.134Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-07T21:08:03.861Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-08T12:34:27.808Z"}]
b7282868-f54c-4fb4-b0a4-8d665b3735d9	Morango	excluidos	2026-04-18	2026-05-06	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	2	2026-04-29 16:22:16.125+00	2026-05-06	2026-05-08 12:34:27.808+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T16:22:16.125Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-06T20:14:50.086Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-06T20:15:09.439Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-08T12:34:27.808Z"}]
5bafa92b-57f3-40f8-a698-471bf8ca1453	Leite Condensado com Morango	excluidos	2026-04-22	2026-04-30	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	3	2026-04-29 16:23:02.338+00	2026-05-07	2026-05-08 12:34:27.808+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T16:23:02.338Z"}, {"user": "amandacorte053@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-04-30T15:24:45.713Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-07T21:08:14.111Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-08T12:34:27.808Z"}]
90be1e00-fa81-4c4e-b0c3-2afea8926754	Abacaxi com Hortelã e Gengibre	excluidos	2026-04-23	2026-05-01	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	4	2026-04-29 16:26:20.926+00	2026-05-30	2026-05-30 18:09:55.554+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T16:26:20.926Z"}, {"user": "amandacorte053@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-01T20:23:07.505Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-30T14:55:55.037Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-30T18:09:55.558Z"}]
bc477f62-f546-421a-bcce-63251839aced	Chocolate	excluidos	2026-04-24	2026-04-30	cassiafernanda344@gmail.com	amandacorte053@gmail.com	7	2026-04-29 16:28:57.856+00	2026-05-06	2026-05-08 12:34:27.808+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T16:28:57.856Z"}, {"user": "amandacorte053@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-04-30T15:18:33.431Z"}, {"user": "amandacorte053@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-06T14:52:14.808Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-08T12:34:27.808Z"}]
7f8382f5-bb92-4720-a55e-25d697ab7765	Morango	excluidos	2026-04-03	2026-04-19	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	8	2026-04-29 16:29:25.128+00	2026-05-31	2026-05-31 16:24:19.713+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T16:29:25.128Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Movido para Vitrine", "timestamp": "2026-04-29T16:29:31.554Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-31T15:41:55.823Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-31T16:24:19.713Z"}]
cf3f8ccb-8991-46ad-9cf5-ac9ba8095da9	Don Vitto	excluidos	2026-04-08	2026-04-21	cassiafernanda344@gmail.com	amandacorte053@gmail.com	9	2026-04-29 16:30:57.053+00	2026-04-30	2026-05-01 14:19:09.1+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T16:30:57.053Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Movido para Vitrine", "timestamp": "2026-04-29T16:31:00.160Z"}, {"user": "amandacorte053@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-04-30T15:24:42.127Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-01T14:19:09.102Z"}]
b3bca938-fa77-4864-bc4c-94ddbb79654b	Limão Tahiti	excluidos	2026-04-04	2026-04-19	cassiafernanda344@gmail.com	amandacorte053@gmail.com	10	2026-04-29 16:34:55.88+00	2026-05-01	2026-05-02 13:28:21.957+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T16:34:55.880Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Movido para Vitrine", "timestamp": "2026-04-29T16:34:58.966Z"}, {"user": "amandacorte053@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-01T20:22:59.263Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-02T13:28:21.959Z"}]
eac9c55f-39b5-455b-834f-14cba1501ed8	Pistache	cubas-saidas-vitrine	2026-05-17	2026-05-24	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	34	2026-05-16 15:15:50.158+00	2026-05-31	2026-05-31 18:52:52.27+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-16T15:15:50.158Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-24T17:40:59.086Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-31T18:52:52.270Z"}]
d0e3fc32-bdf8-4313-aefc-744046acc0b0	Doce de Leite	quebras	2026-05-16	\N	amandacorte053@gmail.com	amandacorte053@gmail.com	44	2026-05-18 17:30:05.258+00	\N	2026-05-18 17:30:05.258+00	[{"user": "amandacorte053@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-18T17:30:05.258Z"}]
cbc8c299-1e55-43b3-9cf2-64010dc92089	Café	quebras	2026-04-22	\N	henocera@gmail.com	henocera@gmail.com	55	2026-05-18 19:37:25.513+00	\N	2026-05-18 19:37:25.513+00	[{"user": "henocera@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-18T19:37:25.513Z"}]
622dedb8-6663-4a62-bcef-36ce5498f12c	Stracciatella	excluidos	2026-04-24	2026-05-04	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	6	2026-04-29 16:28:23.664+00	2026-05-16	2026-05-17 15:33:01.175+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T16:28:23.664Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-04T17:03:02.244Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-16T20:25:01.557Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-17T15:33:01.175Z"}]
ea116255-c5a8-459f-be56-2c1140abd1b0	Iogurte com Laranja	excluidos	2026-04-22	2026-04-25	cassiafernanda344@gmail.com	amandacorte053@gmail.com	11	2026-04-29 16:35:18.951+00	2026-05-03	2026-05-05 21:55:30.143+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T16:35:18.951Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Movido para Vitrine", "timestamp": "2026-04-29T16:35:29.654Z"}, {"user": "amandacorte053@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-03T19:54:48.773Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-05T21:55:30.148Z"}]
806c6c94-a573-4cbb-850f-d47ac9f619f8	Coco Diet	excluidos	2026-04-23	2026-04-25	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	12	2026-04-29 16:35:53.816+00	2026-05-04	2026-05-05 21:55:30.148+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T16:35:53.816Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Movido para Vitrine", "timestamp": "2026-04-29T16:35:57.652Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-04T17:02:35.548Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-05T21:55:30.148Z"}]
85f1427e-8d6f-44a7-8943-08c97a68d996	Chocolate	excluidos	2026-04-22	2026-04-25	cassiafernanda344@gmail.com	amandacorte053@gmail.com	13	2026-04-29 16:36:13.873+00	2026-04-30	2026-05-01 14:19:09.102+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T16:36:13.873Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Movido para Vitrine", "timestamp": "2026-04-29T16:36:15.904Z"}, {"user": "amandacorte053@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-04-30T15:18:30.235Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-01T14:19:09.102Z"}]
6bb3781f-6a23-409b-a874-4a07cabbee89	Cheesecake de Frutas Vermelhas	excluidos	2026-04-16	2026-04-29	cassiafernanda344@gmail.com	amandacorte053@gmail.com	20	2026-04-29 19:11:35.112+00	2026-05-01	2026-05-02 13:28:21.96+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T19:11:35.112Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Movido para Vitrine", "timestamp": "2026-04-29T19:11:42.794Z"}, {"user": "henocera@gmail.com", "action": "Movido para Arquivo", "timestamp": "2026-04-29T19:27:33.615Z"}, {"user": "henocera@gmail.com", "action": "Movido para Vitrine", "timestamp": "2026-04-29T19:27:50.458Z"}, {"user": "amandacorte053@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-01T19:46:47.493Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-02T13:28:21.960Z"}]
2e69032f-1ff1-47dc-b3e2-fe782da51bc9	Leite Ninho com Nutella	quebras	2026-05-22	\N	amandacorte053@gmail.com	amandacorte053@gmail.com	58	2026-05-22 16:18:22.752+00	\N	2026-05-22 16:18:22.752+00	[{"user": "amandacorte053@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine)", "timestamp": "2026-05-22T16:18:22.752Z"}]
ce221229-2797-4406-b648-131971df0de0	Pistache	excluidos	2026-04-24	2026-04-26	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	14	2026-04-29 16:36:31.554+00	2026-05-02	2026-05-05 21:55:30.148+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T16:36:31.554Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Movido para Vitrine", "timestamp": "2026-04-29T19:06:12.311Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-02T22:03:47.381Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-05T21:55:30.148Z"}]
4790585a-5cd3-45d8-8845-67a9447817df	Baunilha	excluidos	2026-04-06	2026-04-26	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	15	2026-04-29 16:37:08.701+00	2026-05-10	2026-05-11 00:25:57.207+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T16:37:08.701Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Movido para Vitrine", "timestamp": "2026-04-29T16:40:49.179Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-10T14:48:18.847Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-11T00:25:57.207Z"}]
0171bff8-4c90-40fd-bb41-78737b45df42	Banana Nevada	excluidos	2026-04-06	2026-04-26	cassiafernanda344@gmail.com	amandacorte053@gmail.com	16	2026-04-29 16:39:08.105+00	2026-05-01	2026-05-02 13:28:21.96+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T16:39:08.105Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Movido para Vitrine", "timestamp": "2026-04-29T16:39:11.136Z"}, {"user": "amandacorte053@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-01T19:46:56.346Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-02T13:28:21.960Z"}]
b653a161-7998-43a4-829e-9616138b67cc	Maracujá	excluidos	2026-04-18	2026-04-26	cassiafernanda344@gmail.com	amandacorte053@gmail.com	17	2026-04-29 16:39:36.507+00	2026-05-13	2026-05-14 15:43:25.928+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T16:39:36.507Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Movido para Vitrine", "timestamp": "2026-04-29T16:39:38.832Z"}, {"user": "amandacorte053@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-13T20:36:29.414Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-14T15:43:25.934Z"}]
231deff6-923c-46c0-a4f4-77dfcbd77205	Baunilha	excluidos	2026-04-22	2026-05-20	amandacorte053@gmail.com	henocera@gmail.com	26	2026-05-01 16:34:24.143+00	2026-05-20	2026-05-21 13:13:25.745+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-01T16:34:24.143Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-10T14:48:21.276Z"}, {"user": "henocera@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-20T14:17:40.302Z"}, {"user": "henocera@gmail.com", "action": "Arquivo → Vitrine Atual", "timestamp": "2026-05-20T14:18:21.458Z"}, {"user": "henocera@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-20T14:18:58.001Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-21T13:13:25.745Z"}]
51164569-4d29-4ac3-88d5-958435d1482a	Torta Belga	quebras	2026-05-25	\N	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	70	2026-05-25 21:11:09.548+00	\N	2026-05-25 21:11:09.548+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine)", "timestamp": "2026-05-25T21:11:09.548Z"}]
9b8ede65-7d7c-43e6-a534-f50372c9bc52	Maracujá	excluidos	2026-04-23	2026-05-13	amandacorte053@gmail.com	cassiafernanda344@gmail.com	21	2026-05-01 16:30:08.904+00	2026-05-31	2026-05-31 16:24:19.713+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-01T16:30:08.904Z"}, {"user": "amandacorte053@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-13T20:36:31.921Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-31T15:41:48.883Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-31T16:24:19.713Z"}]
65608bdf-0c7d-495f-b034-8f84405c3ab6	Don Vitto	excluidos	2026-04-24	2026-05-06	amandacorte053@gmail.com	cassiafernanda344@gmail.com	25	2026-05-01 16:31:47.941+00	2026-05-16	2026-05-17 15:33:01.176+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-01T16:31:47.941Z"}, {"user": "amandacorte053@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-06T14:52:27.831Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-16T18:19:01.743Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-17T15:33:01.176Z"}]
ae8e2880-e489-4bab-b1d4-241b96845811	Pistache	excluidos	2026-05-02	2026-05-14	amandacorte053@gmail.com	cassiafernanda344@gmail.com	27	2026-05-03 20:23:58.31+00	2026-05-14	2026-05-14 17:14:52.222+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-03T20:23:58.310Z"}, {"user": "amandacorte053@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-03T20:37:37.633Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Freezer Estoque", "timestamp": "2026-05-10T14:45:51.613Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-14T16:30:07.362Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-14T16:30:09.555Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-14T17:14:52.222Z"}]
ffacb333-f30c-4087-9f54-0b8393aa4361	Pistache	excluidos	2026-05-09	2026-05-10	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	28	2026-05-10 14:44:39.051+00	2026-05-21	2026-05-25 20:11:03.43+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-10T14:44:39.051Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-10T14:46:02.825Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-21T21:43:12.158Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-25T20:11:03.430Z"}]
d29dc643-f764-4ff2-978f-2431ef93bf20	Cheesecake de Frutas Vermelhas	quebras	2026-05-31	\N	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	86	2026-05-31 20:43:43.001+00	\N	2026-05-31 20:43:43.001+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine)", "timestamp": "2026-05-31T20:43:43.001Z"}]
e915631b-c884-4f06-b19f-bdb4340414aa	Coco Diet	excluidos	2026-04-23	2026-05-09	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	5	2026-04-29 16:26:53.796+00	2026-05-27	2026-05-28 12:54:58.168+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T16:26:53.796Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-09T14:51:05.536Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-27T19:36:56.888Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-28T12:54:58.168Z"}]
3a653fa0-6288-4454-86a1-f151963fe9e9	Cheesecake de Frutas Vermelhas	cubas-saidas-vitrine	2026-04-09	2026-05-25	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	29	2026-05-10 14:45:43.693+00	2026-05-31	2026-05-31 20:43:41.51+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-10T14:45:43.693Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-16T20:25:03.524Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Freezer Estoque", "timestamp": "2026-05-24T17:40:51.856Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-25T21:11:16.864Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-31T20:43:41.510Z"}]
4af8bc33-9f87-4114-8391-e228d555235a	Leite Condensado com Morango	excluidos	2026-04-30	2026-05-18	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	30	2026-05-10 14:46:40.73+00	2026-05-30	2026-05-31 16:24:19.713+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-10T14:46:40.730Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-17T14:52:01.744Z"}, {"user": "henocera@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-18T16:35:38.362Z"}, {"user": "henocera@gmail.com", "action": "Arquivo → Vitrine Atual", "timestamp": "2026-05-18T16:35:42.962Z"}, {"user": "henocera@gmail.com", "action": "Data de saída removida", "timestamp": "2026-05-18T16:35:47.122Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-30T21:48:35.178Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-31T16:24:19.713Z"}]
066ab3cb-0f64-4d6a-8dce-3093a0f79673	Chocolate	vitrine-atual	2026-05-21	2026-05-29	amandacorte053@gmail.com	amandacorte053@gmail.com	71	2026-05-28 20:03:36.338+00	\N	2026-05-29 20:45:41.65+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-28T20:03:36.338Z"}, {"user": "amandacorte053@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-29T20:45:41.650Z"}]
fed06106-dd12-4d54-8fc1-d42d1935b99f	Don Vitto	quebras	2026-05-30	\N	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	73	2026-05-30 14:53:35.568+00	\N	2026-05-30 14:53:35.568+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine - Item 1 de 2)", "timestamp": "2026-05-30T14:53:35.568Z"}]
d494f0ec-b2d8-4c5e-aecf-1b0ce5e995ad	Leite Ninho com Nutella	vitrine-atual	2026-05-28	2026-05-31	cassiafernanda344@gmail.com	henocera@gmail.com	77	2026-05-30 17:30:26.762+00	\N	2026-05-31 19:25:35.844+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-30T17:30:26.762Z"}, {"user": "henocera@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-31T19:25:35.844Z"}]
f561b93c-ec6a-4b5d-b9be-dcaac2adbb60	Chocolate	freezer-estoque	2026-05-29	\N	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	79	2026-05-30 17:31:19.23+00	\N	2026-05-30 17:31:19.23+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-30T17:31:19.230Z"}]
664f2bfe-ce9f-47dc-9c67-774b1aa80871	Leite Ninho com Nutella	excluidos	2026-04-30	2026-05-16	cassiafernanda344@gmail.com	amandacorte053@gmail.com	31	2026-05-10 14:47:10.403+00	2026-05-22	2026-05-25 20:11:03.43+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-10T14:47:10.403Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-16T20:35:14.706Z"}, {"user": "amandacorte053@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-22T16:18:20.762Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-25T20:11:03.430Z"}]
c1415787-3524-467d-968d-c91d11db539a	Chocolate	excluidos	2026-04-29	2026-05-10	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	32	2026-05-10 14:47:41.817+00	2026-05-16	2026-05-17 15:33:01.176+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-10T14:47:41.817Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-10T14:47:57.068Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-16T15:13:15.952Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-17T15:33:01.176Z"}]
369037f0-6217-4032-acad-47ae9dfdec9f	Chocolate	excluidos	2026-05-08	2026-05-20	cassiafernanda344@gmail.com	henocera@gmail.com	33	2026-05-16 15:13:45.386+00	2026-05-20	2026-05-21 13:13:25.745+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-16T15:13:45.386Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-16T15:13:48.885Z"}, {"user": "henocera@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-20T14:17:24.090Z"}, {"user": "henocera@gmail.com", "action": "Arquivo → Vitrine Atual", "timestamp": "2026-05-20T14:18:23.237Z"}, {"user": "henocera@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-20T14:18:55.072Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-21T13:13:25.745Z"}]
37a4bec7-c8b0-45b7-a523-d72d4567b833	Frutas Vermelhas	vitrine-atual	2026-05-07	2026-05-20	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	35	2026-05-16 15:16:09.138+00	\N	2026-05-20 14:38:43.622+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-16T15:16:09.138Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-20T14:38:43.622Z"}]
7d5de92f-2128-45b9-947f-f6a5800a60e5	Chocolate	excluidos	2026-05-08	2026-05-26	amandacorte053@gmail.com	cassiafernanda344@gmail.com	36	2026-05-17 17:51:46.123+00	2026-05-26	2026-05-26 22:07:50.43+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-17T17:51:46.123Z"}, {"user": "henocera@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-20T14:17:19.707Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Freezer Estoque", "timestamp": "2026-05-24T21:06:51.048Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-26T14:52:02.650Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-26T14:52:05.873Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-26T22:07:50.430Z"}]
81917cbd-dcb3-411a-ad0f-fbd5e054b41b	Paçoca com Chocolate	quebras	2026-04-25	\N	amandacorte053@gmail.com	amandacorte053@gmail.com	42	2026-05-18 17:29:40.436+00	\N	2026-05-18 17:29:40.436+00	[{"user": "amandacorte053@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-18T17:29:40.436Z"}]
fccf8ca2-9dbc-42a5-851f-2fb049551100	Baunilha	excluidos	2026-04-24	2026-05-20	henocera@gmail.com	cassiafernanda344@gmail.com	39	2026-05-18 15:26:11.703+00	2026-05-27	2026-05-28 12:54:58.168+00	[{"user": "henocera@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-18T15:26:11.703Z"}, {"user": "henocera@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-20T14:17:16.447Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-27T19:37:08.296Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-28T12:54:58.168Z"}]
94a74d09-3cbe-4f65-bb51-bfe6f66e53df	Doce de Leite	quebras	2026-04-19	\N	amandacorte053@gmail.com	amandacorte053@gmail.com	43	2026-05-18 17:29:56.495+00	\N	2026-05-18 17:29:56.495+00	[{"user": "amandacorte053@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-18T17:29:56.495Z"}]
68acca21-21a4-4238-81d6-4d0cb8b427cd	Caramelo Salgado	quebras	2026-04-26	\N	amandacorte053@gmail.com	amandacorte053@gmail.com	46	2026-05-18 17:30:40.653+00	\N	2026-05-18 17:30:40.653+00	[{"user": "amandacorte053@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-18T17:30:40.653Z"}]
2ac185f8-1591-40a4-a20e-d26b15bf2921	Milho Verde	quebras	2026-04-18	\N	amandacorte053@gmail.com	amandacorte053@gmail.com	49	2026-05-18 17:32:35.899+00	\N	2026-05-18 17:32:35.899+00	[{"user": "amandacorte053@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-18T17:32:35.899Z"}]
b4d8700d-cf91-4bb7-b163-b99e67244a14	Milho Verde	quebras	2026-04-18	\N	amandacorte053@gmail.com	amandacorte053@gmail.com	50	2026-05-18 17:32:44.234+00	\N	2026-05-18 17:32:44.234+00	[{"user": "amandacorte053@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-18T17:32:44.234Z"}]
c20dbe91-5941-45a8-80bb-1905ff6ba168	Chocolate Branco com Maracujá	quebras	2026-04-14	\N	amandacorte053@gmail.com	amandacorte053@gmail.com	51	2026-05-18 17:33:11.178+00	\N	2026-05-18 17:33:11.178+00	[{"user": "amandacorte053@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-18T17:33:11.178Z"}]
65371443-99a7-4d14-a1ed-c0714c9863b7	Chocolate Branco com Maracujá	quebras	2026-05-17	\N	amandacorte053@gmail.com	amandacorte053@gmail.com	52	2026-05-18 17:33:24.744+00	\N	2026-05-18 17:33:24.744+00	[{"user": "amandacorte053@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-18T17:33:24.744Z"}]
3b761a9b-b6b1-4ace-a22c-dae2bf9f27e5	Chocolate Branco com Maracujá	quebras	2026-05-17	\N	amandacorte053@gmail.com	amandacorte053@gmail.com	53	2026-05-18 17:33:32.392+00	\N	2026-05-18 17:33:32.392+00	[{"user": "amandacorte053@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-18T17:33:32.392Z"}]
c749d0fd-9df2-47d3-97e2-9eee22c890b2	Leite Condensado com Morango	quebras	2026-05-30	\N	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	80	2026-05-30 21:48:39.449+00	\N	2026-05-30 21:48:39.449+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine - Item 1 de 2)", "timestamp": "2026-05-30T21:48:39.449Z"}]
fc557a85-a803-49df-abfc-62a6412a29c6	Don Vitto	excluidos	2026-05-13	2026-05-22	amandacorte053@gmail.com	cassiafernanda344@gmail.com	37	2026-05-17 17:52:01.699+00	2026-05-30	2026-05-30 18:09:55.558+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-17T17:52:01.699Z"}, {"user": "amandacorte053@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-22T16:18:43.429Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-30T14:53:33.712Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-30T18:09:55.559Z"}]
6f01a6cb-6fff-4e8e-a260-31b5cbfc34f4	Leite Condensado com Morango	quebras	2026-05-30	\N	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	81	2026-05-30 21:48:39.449+00	\N	2026-05-30 21:48:39.449+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine - Item 2 de 2)", "timestamp": "2026-05-30T21:48:39.449Z"}]
d0e85ec7-a635-46f0-b6fe-653bd04d5a6c	Pistache	vitrine-atual	2026-05-29	2026-05-31	marina_nocera@yahoo.com.br	cassiafernanda344@gmail.com	82	2026-05-31 16:31:32.46+00	\N	2026-05-31 18:53:07.974+00	[{"user": "marina_nocera@yahoo.com.br", "action": "Criado no Estoque", "timestamp": "2026-05-31T16:31:32.461Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-31T18:53:07.974Z"}]
4551571d-a2b8-4c5c-9c24-4c5dd5d5fe7b	Paçoca com Chocolate	quebras	2026-04-25	\N	amandacorte053@gmail.com	amandacorte053@gmail.com	40	2026-05-18 17:29:10.377+00	\N	2026-05-18 17:29:10.377+00	[{"user": "amandacorte053@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-18T17:29:10.377Z"}]
2ba28a4b-c3b3-40dd-95e0-44483b5bb49c	Paçoca com Chocolate	quebras	2026-04-25	\N	amandacorte053@gmail.com	amandacorte053@gmail.com	41	2026-05-18 17:29:28.498+00	\N	2026-05-18 17:29:28.498+00	[{"user": "amandacorte053@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-18T17:29:28.498Z"}]
d18600d1-7cd9-4b80-8496-beb869f49378	Caramelo Salgado	quebras	2026-04-26	\N	amandacorte053@gmail.com	amandacorte053@gmail.com	47	2026-05-18 17:30:51.671+00	\N	2026-05-18 17:30:51.671+00	[{"user": "amandacorte053@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-18T17:30:51.671Z"}]
ab9e3174-fa89-4f2b-9a21-9ae14f4049cc	Caramelo Salgado	quebras	2026-04-26	\N	amandacorte053@gmail.com	amandacorte053@gmail.com	48	2026-05-18 17:31:07.981+00	\N	2026-05-18 17:31:07.981+00	[{"user": "amandacorte053@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-18T17:31:07.981Z"}]
67bf7740-a836-4472-bbac-9c05cac14b92	Chocolate Branco com Maracujá	quebras	2026-05-17	\N	amandacorte053@gmail.com	amandacorte053@gmail.com	54	2026-05-18 17:33:41.387+00	\N	2026-05-18 17:33:41.387+00	[{"user": "amandacorte053@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-18T17:33:41.387Z"}]
96c1967d-b259-429c-b26f-a0f3afc4916a	Coco com Doce de Leite	quebras	2026-03-28	\N	henocera@gmail.com	henocera@gmail.com	57	2026-05-18 19:37:39.817+00	\N	2026-05-18 19:37:39.817+00	[{"user": "henocera@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-18T19:37:39.817Z"}]
01956fd6-b660-424d-9e66-f63833e7f899	Dolce Mocha	freezer-estoque	2026-05-20	\N	amandacorte053@gmail.com	amandacorte053@gmail.com	59	2026-05-22 17:35:57.986+00	\N	2026-05-22 17:35:57.986+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:35:57.986Z"}]
d2020539-266e-4aa8-8363-1b4ba6fac589	Coco Diet	vitrine-atual	2026-04-23	2026-05-30	amandacorte053@gmail.com	cassiafernanda344@gmail.com	60	2026-05-22 17:36:16.587+00	\N	2026-05-30 14:53:43.532+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:36:16.587Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-27T19:36:38.834Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Freezer Estoque", "timestamp": "2026-05-27T19:36:42.326Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-30T14:53:43.532Z"}]
f989aa9e-72b3-4771-af92-5c804b4f891a	Abacaxi com Hortelã e Gengibre	vitrine-atual	2026-05-07	2026-05-30	amandacorte053@gmail.com	cassiafernanda344@gmail.com	61	2026-05-22 17:36:35.235+00	\N	2026-05-30 14:55:58.469+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:36:35.235Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-30T14:55:58.469Z"}]
3c6be3a2-c575-4493-b953-aec1d3600cc5	Morango	vitrine-atual	2026-04-25	2026-05-31	amandacorte053@gmail.com	cassiafernanda344@gmail.com	62	2026-05-22 17:36:50.633+00	\N	2026-05-31 15:42:09.249+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:36:50.633Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-31T15:42:09.249Z"}]
97a30689-faa3-45bc-9ea9-ca86bb8f3988	Baunilha	freezer-estoque	2026-05-21	\N	amandacorte053@gmail.com	amandacorte053@gmail.com	72	2026-05-28 20:03:58.767+00	\N	2026-05-28 20:03:58.767+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-28T20:03:58.767Z"}]
990e34fa-a1c5-4327-b7c6-72add440249c	Pistache	quebras	2026-05-31	\N	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	83	2026-05-31 18:52:54.053+00	\N	2026-05-31 18:52:54.053+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine)", "timestamp": "2026-05-31T18:52:54.053Z"}]
87d9d606-11d5-48fc-b15d-485101bb84cd	Torta Belga	excluidos	2026-05-08	2026-05-21	amandacorte053@gmail.com	cassiafernanda344@gmail.com	38	2026-05-17 17:53:04.075+00	2026-05-25	2026-05-26 22:07:50.43+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-17T17:53:04.075Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-21T21:46:58.465Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-25T21:11:07.634Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-26T22:07:50.430Z"}]
659dcd42-4e7e-4611-8725-5d606dbb4225	Doce de Leite	quebras	2026-04-19	\N	amandacorte053@gmail.com	amandacorte053@gmail.com	45	2026-05-18 17:30:14.708+00	\N	2026-05-18 17:30:14.708+00	[{"user": "amandacorte053@gmail.com", "action": "Criado em Quebras", "timestamp": "2026-05-18T17:30:14.708Z"}]
7dc2e1db-d73b-4059-8a79-15abc5296104	Chocolate	excluidos	2026-05-08	2026-05-24	amandacorte053@gmail.com	amandacorte053@gmail.com	63	2026-05-22 17:37:10.185+00	2026-05-29	2026-05-30 18:09:55.559+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:37:10.185Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-24T21:06:56.413Z"}, {"user": "amandacorte053@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-29T20:45:34.009Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-30T18:09:55.559Z"}]
38e0b403-e7f5-4275-8b6e-3df1bb536ddf	Baunilha	vitrine-atual	2026-04-30	2026-05-28	amandacorte053@gmail.com	henocera@gmail.com	64	2026-05-22 17:37:26.057+00	\N	2026-05-28 16:53:01.938+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:37:26.057Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-27T19:37:56.853Z"}, {"user": "henocera@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-28T16:52:42.297Z"}, {"user": "henocera@gmail.com", "action": "Arquivo → Vitrine Atual", "timestamp": "2026-05-28T16:52:57.393Z"}, {"user": "henocera@gmail.com", "action": "Data de saída removida", "timestamp": "2026-05-28T16:53:01.937Z"}]
7b824247-b0e4-43ed-9a4c-7d72ee93fbeb	Maracujá	vitrine-atual	2026-05-07	2026-05-31	amandacorte053@gmail.com	cassiafernanda344@gmail.com	65	2026-05-22 17:37:37.81+00	\N	2026-05-31 15:42:19.521+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:37:37.810Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-31T15:42:19.521Z"}]
6e9b3740-6191-4458-ba22-65072080f402	Paçoca com Chocolate	freezer-estoque	2026-05-15	\N	amandacorte053@gmail.com	amandacorte053@gmail.com	66	2026-05-22 17:37:52.716+00	\N	2026-05-22 17:37:52.716+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:37:52.716Z"}]
3ffd3808-3eef-44c4-82a6-4179947ec81a	Banoffe	vitrine-atual	2026-04-29	2026-05-27	amandacorte053@gmail.com	cassiafernanda344@gmail.com	67	2026-05-22 17:38:08.705+00	\N	2026-05-27 19:37:51.136+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:38:08.705Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-27T19:37:51.136Z"}]
2d795157-7f5d-4be7-a206-5457c9128f84	Iogurte com Amarena	vitrine-atual	2026-04-30	2026-05-30	amandacorte053@gmail.com	cassiafernanda344@gmail.com	68	2026-05-22 17:38:23.423+00	\N	2026-05-30 21:48:42.068+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:38:23.423Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-30T21:48:42.068Z"}]
f367f3db-6701-40df-bd89-f91b8917d656	Chocolate Branco com Maracujá	excluidos	2026-04-14	2026-05-16	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	19	2026-04-29 19:07:46.34+00	2026-05-17	2026-05-17 15:33:01.176+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-04-29T19:07:46.340Z"}, {"user": "henocera@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-04-29T20:24:16.895Z"}, {"user": "henocera@gmail.com", "action": "Vitrine Atual → Freezer Estoque", "timestamp": "2026-04-29T20:24:26.561Z"}, {"user": "henocera@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-01T21:17:22.760Z"}, {"user": "henocera@gmail.com", "action": "Vitrine Atual → Freezer Estoque", "timestamp": "2026-05-01T21:17:39.424Z"}, {"user": "amandacorte053@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-03T19:54:51.736Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Freezer Estoque", "timestamp": "2026-05-09T14:50:57.717Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-16T18:20:49.971Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-17T14:51:56.206Z"}, {"user": "marina_nocera@yahoo.com.br", "action": "Arquivo → Histórico Excluídos (Massa)", "timestamp": "2026-05-17T15:33:01.176Z"}]
0e440ad8-84a6-4f47-8f98-e2fa00beeb47	Stracciatella	cubas-saidas-vitrine	2026-04-06	2026-05-22	amandacorte053@gmail.com	henocera@gmail.com	69	2026-05-22 17:38:40.917+00	2026-05-31	2026-05-31 19:24:37.77+00	[{"user": "amandacorte053@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-22T17:38:40.917Z"}, {"user": "amandacorte053@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-22T20:33:21.543Z"}, {"user": "henocera@gmail.com", "action": "Vitrine Atual → Arquivo", "timestamp": "2026-05-31T19:24:37.770Z"}]
13ea1012-9022-42e7-b863-b327285439ad	Don Vitto	quebras	2026-05-30	\N	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	74	2026-05-30 14:53:35.568+00	\N	2026-05-30 14:53:35.568+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine - Item 2 de 2)", "timestamp": "2026-05-30T14:53:35.568Z"}]
f9633461-b8b6-4511-b0fb-5ce18abf8687	Danoninho	freezer-estoque	2026-05-21	\N	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	75	2026-05-30 17:29:22.849+00	\N	2026-05-30 17:29:22.849+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-30T17:29:22.849Z"}]
66899a4a-5bb1-4dbb-af1e-c45753bacd83	Milho Verde	freezer-estoque	2026-05-13	\N	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	76	2026-05-30 17:30:09.003+00	\N	2026-05-30 17:30:09.003+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-30T17:30:09.003Z"}]
66ce78a8-c523-4e6b-bae4-c69ba4c72d9f	Don Vitto	vitrine-atual	2026-05-13	2026-05-31	cassiafernanda344@gmail.com	cassiafernanda344@gmail.com	78	2026-05-30 17:30:44.639+00	\N	2026-05-31 20:43:51.078+00	[{"user": "cassiafernanda344@gmail.com", "action": "Criado no Estoque", "timestamp": "2026-05-30T17:30:44.639Z"}, {"user": "cassiafernanda344@gmail.com", "action": "Freezer Estoque → Vitrine Atual", "timestamp": "2026-05-31T20:43:51.078Z"}]
eb528531-0605-4e5a-85ba-52bc1cdd67ff	Stracciatella	quebras	2026-05-31	\N	henocera@gmail.com	henocera@gmail.com	84	2026-05-31 19:25:15.339+00	\N	2026-05-31 19:25:15.339+00	[{"user": "henocera@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine - Item 1 de 2)", "timestamp": "2026-05-31T19:25:15.339Z"}]
9e4a123a-0e7a-4080-acae-e831bf57bef7	Stracciatella	quebras	2026-05-31	\N	henocera@gmail.com	henocera@gmail.com	85	2026-05-31 19:25:15.339+00	\N	2026-05-31 19:25:15.339+00	[{"user": "henocera@gmail.com", "action": "Criado em Quebras (Auto via Saída da Vitrine - Item 2 de 2)", "timestamp": "2026-05-31T19:25:15.339Z"}]
\.


--
-- Data for Name: entradas_mercadoria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."entradas_mercadoria" ("id", "insumo_id", "data_compra", "fornecedor", "quantidade_comprada", "valor_unitario", "created_at") FROM stdin;
\.


--
-- Data for Name: feriados_globais; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."feriados_globais" ("id", "date", "name", "created_at") FROM stdin;
59ce6ecf-feab-4c7d-a480-9262080835a5	2026-05-01	Dia do Trabalho	2026-05-27 02:46:27.97898+00
af6187b9-6949-4105-a63a-559addda5bf6	2026-04-21	Dia de Tiradentes	2026-05-27 03:23:00.838257+00
54967f51-e8d6-4c8c-8d0f-fa12a58451c9	2026-04-03	Sexta Feira Santa	2026-05-28 17:12:46.662379+00
0ddfc0ed-52e3-4fc9-85eb-a9f1f7a6a445	2026-09-07	Independência do Brasil	2026-05-29 18:25:27.851273+00
9e33d8ac-5fc9-4564-951a-3622c1e20af3	2026-10-12	Nossa Senhora Aparecida	2026-05-29 18:25:38.236481+00
d28a2c77-b305-4983-9ab5-49fec158af40	2026-06-04	Corpus Christi	2026-05-30 20:08:25.492404+00
\.


--
-- Data for Name: feriados_trabalhados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."feriados_trabalhados" ("id", "employee_id", "data_feriado", "nome_feriado", "data_folga", "created_at", "pago_em_dobro") FROM stdin;
e119f9a0-4137-417c-a200-380b3b50c166	1d621888-613a-4a15-b796-3c4120f51af2	2026-04-21	Dia de Tiradentes	2026-04-20	2026-05-28 18:03:44.742199+00	f
cbb928c0-4f4b-48db-bc0f-c81a023aa72b	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	2026-05-01	Dia do Trabalho	\N	2026-05-27 13:18:06.003476+00	f
4a064098-6026-4038-a630-ee0906d94ac7	16ddd940-9f73-4313-ba08-9ee96735181c	2026-05-01	Dia do Trabalho	\N	2026-05-27 13:22:07.511831+00	f
394eb906-70db-4703-83a4-6b41127c1d5e	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-05-01	Dia do Trabalho	\N	2026-05-27 13:22:18.855068+00	f
ba95ac4a-d3fc-45e5-917b-c5a77fcd1ca1	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-04-03	Sexta Feira Santa	2026-04-28	2026-05-28 17:14:10.22573+00	f
5a2a69af-fdaf-4857-9e0b-1266038fc37f	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-04-21	Dia de Tiradentes	2026-05-19	2026-05-27 13:22:19.758245+00	f
c2bde6c3-4c5d-4818-9b76-b4b822a6f71e	16ddd940-9f73-4313-ba08-9ee96735181c	2026-04-03	Sexta Feira Santa	2026-04-29	2026-05-28 17:40:11.82274+00	f
1743312a-f2be-4977-a6da-0c464ed49e70	054e1fc1-7d77-4ae0-addb-13e440f53d6b	2026-04-21	Dia de Tiradentes	2026-04-30	2026-05-27 13:22:12.840814+00	f
423d60e4-136a-4b72-ad9a-28c73dd11558	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	2026-04-03	Sexta Feira Santa	2026-04-11	2026-05-28 17:53:16.659353+00	f
0c2d9043-d887-44bd-92c6-61aed7541939	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	2026-04-21	Dia de Tiradentes	2026-04-26	2026-05-27 13:18:19.954974+00	f
\.


--
-- Data for Name: ficha_tecnica; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."ficha_tecnica" ("id", "produto_id", "insumo_id", "quantidade", "created_at", "produto_base_id") FROM stdin;
549c1d1a-92d1-482a-ab60-69488815c309	de6b07a4-0339-4f12-95de-d76430659fe1	55519e38-a952-4223-a0a9-4d36d53adb54	1	2026-05-31 18:53:56.669435+00	\N
8fa019e4-5e08-4f1a-92bc-5b9a2ea9895d	de6b07a4-0339-4f12-95de-d76430659fe1	b053e306-2a07-4a66-a8c9-e091785f7df4	1	2026-05-31 18:53:56.669435+00	\N
fb7782a4-7bb1-40ca-a9e4-a96097d949de	de6b07a4-0339-4f12-95de-d76430659fe1	a5f552f1-4392-4c53-977f-08739186fcb5	1	2026-05-31 18:53:56.669435+00	\N
6a741152-d89c-4f77-ae6c-93fb42f48bf8	de6b07a4-0339-4f12-95de-d76430659fe1	8850838c-26df-4793-b742-75c6ae75a10f	1	2026-05-31 18:53:56.669435+00	\N
7d71ab30-80a9-4f96-b7b3-cfc51352e93b	de6b07a4-0339-4f12-95de-d76430659fe1	424d80dc-6975-4812-9571-b3baadd2db31	1	2026-05-31 18:53:56.669435+00	\N
2fd26ba2-b9c5-4019-9f40-85a4ca20968e	de6b07a4-0339-4f12-95de-d76430659fe1	a1b5529d-9572-4c4f-a2bd-b1b2b79bb7f7	1	2026-05-31 18:53:56.669435+00	\N
2472e6f6-2897-4ba9-a3a7-748aa8390149	de6b07a4-0339-4f12-95de-d76430659fe1	7a77e18f-94b7-4efd-8f6e-80964703a15f	2	2026-05-31 18:53:56.669435+00	\N
d0bca40e-d42b-4b01-8482-7bed66155713	de6b07a4-0339-4f12-95de-d76430659fe1	6079efab-6235-4c98-97aa-43417ea5e2d2	1	2026-05-31 18:53:56.669435+00	\N
5bc982da-8a26-4670-8be7-baf953559408	0a87d61a-0a52-43f6-9e63-bc7e9f1f719d	bf54025c-d11a-4598-8a1e-ed2e8a5a17a8	1	2026-05-31 19:04:35.063715+00	\N
4ef541e7-0892-4e9b-b5d4-d174f1c16ba0	0a87d61a-0a52-43f6-9e63-bc7e9f1f719d	521f2d74-463c-4737-bb85-c47d39e96845	1	2026-05-31 19:04:35.063715+00	\N
3773322b-8ec6-473e-b50a-776f8f9b9de4	0a87d61a-0a52-43f6-9e63-bc7e9f1f719d	6e0e7651-b4a0-466f-9541-69d45b2ffdca	0.12	2026-05-31 19:04:35.063715+00	\N
0a233c17-2498-482d-b5c0-e95b48f2f4b5	d7add5c4-088c-47bb-8136-2b95c5b8249e	82fd5205-9fbf-4564-83df-6e16776c4718	1	2026-05-31 19:07:31.767125+00	\N
3a7313ed-e668-4561-81c3-d5d7d9c66c40	b890578d-894b-41ea-8aeb-3fa0b0d94fed	bf54025c-d11a-4598-8a1e-ed2e8a5a17a8	1	2026-05-31 16:28:39.312736+00	\N
d4c69ae2-a44e-40b9-b4ac-612daf78d7be	b890578d-894b-41ea-8aeb-3fa0b0d94fed	6e0e7651-b4a0-466f-9541-69d45b2ffdca	0.14	2026-05-31 16:28:39.312736+00	\N
22735563-2ebe-41b8-a923-e3eb627db6f3	b890578d-894b-41ea-8aeb-3fa0b0d94fed	521f2d74-463c-4737-bb85-c47d39e96845	1	2026-05-31 16:28:39.312736+00	\N
9a527aa0-2b86-4c16-b618-33c9edac6b16	6ed28a48-b705-4067-a6a9-d10be587f0a7	4dd5d67c-767c-42dc-abc9-9cd4539579c6	1	2026-05-31 16:29:16.171675+00	\N
8cd75585-6ec7-4e15-8382-333e82998bac	6ed28a48-b705-4067-a6a9-d10be587f0a7	6e0e7651-b4a0-466f-9541-69d45b2ffdca	0.23	2026-05-31 16:29:16.171675+00	\N
b54afcb2-5a5d-4a83-98bc-e72a6c7bbcee	6ed28a48-b705-4067-a6a9-d10be587f0a7	521f2d74-463c-4737-bb85-c47d39e96845	1	2026-05-31 16:29:16.171675+00	\N
\.


--
-- Data for Name: frequencia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."frequencia" ("id", "employee_id", "date", "status", "updated_at", "observacao", "observacao_by", "observacao_at") FROM stdin;
193	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-05-27	Atraso	2026-05-28 12:54:58.857+00	\N	\N	\N
118	054e1fc1-7d77-4ae0-addb-13e440f53d6b	2026-05-15	Folga Fixa Semanal	2026-05-28 20:40:42.902+00	\N	\N	\N
203	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-04-28	Folga Compensatória	2026-05-28 17:13:45.835+00	\N	\N	\N
205	16ddd940-9f73-4313-ba08-9ee96735181c	2026-05-31	Domingo de Folga	2026-05-28 17:16:58.457+00	\N	\N	\N
120	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-05-21	Trabalhado	2026-05-26 17:32:40.437+00	\N	\N	\N
128	16ddd940-9f73-4313-ba08-9ee96735181c	2026-04-01	Registro Formal	2026-05-26 17:34:55.448+00	\N	\N	\N
129	1d621888-613a-4a15-b796-3c4120f51af2	2026-04-03	Folga Compensatória	2026-05-26 17:35:24.847+00	\N	\N	\N
131	054e1fc1-7d77-4ae0-addb-13e440f53d6b	2026-04-12	Domingo de Folga	2026-05-26 17:36:52.527+00	\N	\N	\N
206	054e1fc1-7d77-4ae0-addb-13e440f53d6b	2026-05-03	Domingo de Folga	2026-05-28 17:19:18.986+00	\N	\N	\N
204	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-05-03	Trabalhado	2026-05-28 17:19:39.511+00	\N	\N	\N
196	054e1fc1-7d77-4ae0-addb-13e440f53d6b	2026-05-27	Atraso	2026-05-28 17:21:19.417+00	Disse que tinha uma prova para fazer e ia se atrasar	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 17:21:19.417+00
80	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-06-07	Domingo de Folga	2026-05-26 12:40:05.685+00	\N	\N	\N
81	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	2026-06-14	Domingo de Folga	2026-05-26 12:40:11.356+00	\N	\N	\N
82	054e1fc1-7d77-4ae0-addb-13e440f53d6b	2026-06-21	Domingo de Folga	2026-05-26 12:40:24.125+00	\N	\N	\N
83	16ddd940-9f73-4313-ba08-9ee96735181c	2026-06-28	Domingo de Folga	2026-05-26 12:40:30.369+00	\N	\N	\N
132	16ddd940-9f73-4313-ba08-9ee96735181c	2026-04-12	Atraso	2026-05-26 17:37:57.083+00	\N	\N	\N
139	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-04-19	Domingo de Folga	2026-05-26 17:38:40.666+00	\N	\N	\N
140	1d621888-613a-4a15-b796-3c4120f51af2	2026-04-20	Folga Compensatória	2026-05-26 17:39:10.358+00	\N	\N	\N
142	16ddd940-9f73-4313-ba08-9ee96735181c	2026-04-26	Domingo de Folga	2026-05-26 17:43:28.908+00	\N	\N	\N
143	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	2026-04-25	Domingo de Folga	2026-05-26 17:44:24.617+00	\N	\N	\N
146	1d621888-613a-4a15-b796-3c4120f51af2	2026-04-28	Atestado	2026-05-26 17:44:52.704+00	\N	\N	\N
147	054e1fc1-7d77-4ae0-addb-13e440f53d6b	2026-04-30	Folga Compensatória	2026-05-26 17:45:23.887+00	\N	\N	\N
208	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-05-17	Domingo de Folga	2026-05-28 17:27:36.287+00	\N	\N	\N
148	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-01	Folga Compensatória	2026-05-26 17:46:38.179+00	\N	\N	\N
151	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-05-06	Atraso	2026-05-26 17:48:37.286+00	\N	\N	\N
125	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-05-22	Atraso	2026-05-26 17:51:29.225+00	\N	\N	\N
155	054e1fc1-7d77-4ae0-addb-13e440f53d6b	2026-03-08	Domingo de Folga	2026-05-26 17:53:20.292+00	\N	\N	\N
156	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	2026-03-15	Domingo de Folga	2026-05-26 17:53:41.896+00	\N	\N	\N
157	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-03-22	Domingo de Folga	2026-05-26 17:54:11.211+00	\N	\N	\N
158	16ddd940-9f73-4313-ba08-9ee96735181c	2026-03-27	Período de Teste	2026-05-26 17:55:01.232+00	\N	\N	\N
159	16ddd940-9f73-4313-ba08-9ee96735181c	2026-03-30	Período de Teste	2026-05-26 17:55:16.411+00	\N	\N	\N
160	16ddd940-9f73-4313-ba08-9ee96735181c	2026-03-31	Período de Teste	2026-05-26 17:55:22.616+00	\N	\N	\N
161	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	2026-02-14	Atestado	2026-05-26 17:56:01.447+00	\N	\N	\N
162	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	2026-02-11	Trabalhado	2026-05-26 17:56:18.923+00	\N	\N	\N
163	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	2026-02-15	Domingo de Folga	2026-05-26 17:56:34.838+00	\N	\N	\N
164	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	2026-02-16	Atestado	2026-05-26 17:56:46.174+00	\N	\N	\N
165	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	2026-02-17	Atestado	2026-05-26 17:56:48.25+00	\N	\N	\N
166	1d621888-613a-4a15-b796-3c4120f51af2	2026-02-16	Folga Compensatória	2026-05-26 17:57:03.427+00	\N	\N	\N
167	1d621888-613a-4a15-b796-3c4120f51af2	2026-02-17	Folga Compensatória	2026-05-26 17:57:10.026+00	\N	\N	\N
168	054e1fc1-7d77-4ae0-addb-13e440f53d6b	2026-02-12	Registro Formal	2026-05-26 17:57:37.934+00	\N	\N	\N
169	054e1fc1-7d77-4ae0-addb-13e440f53d6b	2026-02-09	Período de Teste	2026-05-26 17:58:00.722+00	\N	\N	\N
170	054e1fc1-7d77-4ae0-addb-13e440f53d6b	2026-02-10	Período de Teste	2026-05-26 17:58:04.05+00	\N	\N	\N
171	054e1fc1-7d77-4ae0-addb-13e440f53d6b	2026-02-11	Período de Teste	2026-05-26 17:58:08.526+00	\N	\N	\N
172	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-01-13	Período de Teste	2026-05-26 17:58:59.333+00	\N	\N	\N
173	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-01-15	Período de Teste	2026-05-26 17:59:21.245+00	\N	\N	\N
174	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-01-16	Período de Teste	2026-05-26 17:59:27.749+00	\N	\N	\N
175	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-01-17	Período de Teste	2026-05-26 17:59:29.901+00	\N	\N	\N
176	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-01-18	Folga Fixa Semanal	2026-05-26 18:00:08.789+00	\N	\N	\N
116	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	2026-05-21	Falta Não Justificada	2026-05-26 13:05:20.691+00	Disse que a mãe estava doente, e ficou cuidando dela\n	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-26 13:05:20.691+00
177	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-01-19	Registro Formal	2026-05-26 18:00:12.605+00	\N	\N	\N
178	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-01-25	Folga Fixa Semanal	2026-05-26 18:00:35.237+00	\N	\N	\N
179	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-01-26	Trabalhado	2026-05-26 18:00:38.305+00	\N	\N	\N
180	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-02-01	Folga Fixa Semanal	2026-05-26 18:01:30.54+00	\N	\N	\N
182	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-02-02	Trabalhado	2026-05-26 18:01:32.28+00	\N	\N	\N
183	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-02-15	Folga Fixa Semanal	2026-05-26 18:01:53.48+00	\N	\N	\N
184	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-02-16	Trabalhado	2026-05-26 18:01:56.972+00	\N	\N	\N
185	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-02-22	Folga Fixa Semanal	2026-05-26 18:02:24.164+00	\N	\N	\N
186	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-02-23	Trabalhado	2026-05-26 18:02:27.48+00	\N	\N	\N
187	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	2026-01-01	Férias	2026-05-26 18:05:05.015+00	\N	\N	\N
188	1d621888-613a-4a15-b796-3c4120f51af2	2026-01-01	Férias	2026-05-26 18:05:07.864+00	\N	\N	\N
154	16ddd940-9f73-4313-ba08-9ee96735181c	2026-03-07	Trabalhado	2026-05-26 21:53:54.027+00	\N	\N	\N
190	16ddd940-9f73-4313-ba08-9ee96735181c	2026-03-01	Falta Não Justificada	2026-05-26 21:57:32.954+00	\N	\N	\N
191	16ddd940-9f73-4313-ba08-9ee96735181c	2026-05-01	Trabalhado	2026-05-26 22:07:50.442+00	\N	\N	\N
210	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	2026-05-10	Domingo de Folga	2026-05-28 17:28:20.002+00	\N	\N	\N
213	16ddd940-9f73-4313-ba08-9ee96735181c	2026-04-29	Folga Compensatória	2026-05-28 17:40:01.272+00	\N	\N	\N
152	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-05-19	Folga Compensatória	2026-05-28 20:42:35.039+00	\N	\N	\N
197	16ddd940-9f73-4313-ba08-9ee96735181c	2026-05-27	Trabalhado	2026-05-27 14:41:05.621+00	\N	\N	\N
214	16ddd940-9f73-4313-ba08-9ee96735181c	2026-05-28	Trabalhado	2026-05-28 17:43:13.171+00	\N	\N	\N
225	16ddd940-9f73-4313-ba08-9ee96735181c	2026-05-02	Atraso	2026-05-29 13:55:40.923+00	\N	\N	\N
217	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	2026-04-22	Trabalhado	2026-05-28 17:51:24.832+00	\N	\N	\N
226	16ddd940-9f73-4313-ba08-9ee96735181c	2026-05-03	Atraso	2026-05-29 13:55:43.411+00	\N	\N	\N
141	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	2026-04-24	Folga Fixa Semanal	2026-05-28 17:51:49.095+00	Trocou Quarta pela Sexta como folga fixa semanal\nDias 22 e 24	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-05-28 17:51:49.095+00
130	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	2026-04-11	Folga Compensatória	2026-05-28 20:18:10.118+00	\N	\N	\N
145	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	2026-04-26	Folga Compensatória	2026-05-28 20:18:13.078+00	\N	\N	\N
227	16ddd940-9f73-4313-ba08-9ee96735181c	2026-05-11	Atraso	2026-05-29 13:56:12.918+00	\N	\N	\N
228	16ddd940-9f73-4313-ba08-9ee96735181c	2026-05-13	Atraso	2026-05-29 13:56:17.326+00	\N	\N	\N
229	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-05-05	Atraso	2026-05-29 13:57:46.061+00	\N	\N	\N
230	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-05-12	Atraso	2026-05-29 13:58:02.061+00	\N	\N	\N
231	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-05-14	Atraso	2026-05-29 13:58:15.221+00	\N	\N	\N
232	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	2026-05-18	Atraso	2026-05-29 14:00:55.72+00	\N	\N	\N
233	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-12	Atraso	2026-05-29 14:06:57.113+00	\N	\N	\N
234	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-15	Atraso	2026-05-29 14:07:01.037+00	\N	\N	\N
235	1d621888-613a-4a15-b796-3c4120f51af2	2026-05-18	Atraso	2026-05-29 14:07:17.153+00	\N	\N	\N
\.


--
-- Data for Name: historico_colaborador; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."historico_colaborador" ("id", "employee_id", "created_by", "type", "date", "title", "description", "created_at") FROM stdin;
14	3e43c2e5-3604-48ad-807a-bfa38ebdbfff	35cae5eb-f980-4be0-9998-ac8173ed2afc	Informação	2026-04-01	Aumento de Salário	Aumento de Salário	2026-05-27 02:58:33.938002+00
15	16ddd940-9f73-4313-ba08-9ee96735181c	35cae5eb-f980-4be0-9998-ac8173ed2afc	Advertência	2026-05-16	Advertência	Conduta inadequada, permitindo a entrada de um animal de rua nas dependências da loja	2026-05-29 18:00:15.401779+00
\.


--
-- Data for Name: inventario_insumos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."inventario_insumos" ("id", "created_at", "insumo_id", "data_inventario", "unidade", "quantidade", "user_id", "updated_at") FROM stdin;
4a3b5a4f-0f86-4d40-977f-68921db387a7	2026-06-01 02:36:50.11103+00	bf54025c-d11a-4598-8a1e-ed2e8a5a17a8	2026-05-31	Loja Alto XV	1	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-06-01 02:36:49.791+00
bd461c07-3af0-4600-8062-15f2bb1da7e4	2026-06-01 02:41:11.456303+00	bf54025c-d11a-4598-8a1e-ed2e8a5a17a8	2026-05-31	Loja Ahú	1	35cae5eb-f980-4be0-9998-ac8173ed2afc	\N
\.


--
-- Data for Name: movimentacoes_estoque; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."movimentacoes_estoque" ("id", "created_at", "insumo_id", "data_movimentacao", "quantidade", "origem", "destino", "user_id") FROM stdin;
\.


--
-- Data for Name: rules_confirmations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."rules_confirmations" ("id", "user_id", "confirmed_at") FROM stdin;
5c1fccd6-8e20-44e7-8a43-79b26ed5592c	35cae5eb-f980-4be0-9998-ac8173ed2afc	2026-03-09 14:21:11.369317
ee99b71d-8fd5-4e8f-b6d0-66cea05aff7b	c24dd627-7a1e-407e-9fe0-eefe4d5320c7	2026-03-09 15:25:02.817482
0a770329-b065-43ee-a950-9ec11d372152	78685af2-5b9b-4cb6-99ce-ac7d72251adb	2026-03-11 16:01:59.118198
\.


--
-- Data for Name: salgados_inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."salgados_inventory" ("id", "unit", "collection", "item_name", "quantity", "updated_at") FROM stdin;
6289817b-5956-4a0c-a62e-b260a5d36446	altoxv	sandwich	Carne	3	2026-05-24 14:29:00.352+00
a9df6570-b1bd-46f7-b018-4a64164a620a	ahu	sandwich	Carne	14	2026-05-25 14:44:00.496+00
38c1f2ef-aa69-4194-9da8-d4cb4a13cf64	ahu	sandwich	Parma	13	2026-05-25 14:44:00.724+00
c5ce6ff6-3542-489f-b51c-1a83fe5fcca6	ahu	sandwich	Frango	19	2026-04-22 16:58:35.719+00
88e8d374-cbc2-4d48-83aa-ade0d3c81b81	ahu	quiche	Lorraine	0	2026-05-25 14:44:24.112+00
65cb369e-7ba0-4834-859f-9e99d7c61686	ahu	quiche	Caprese	7	2026-05-25 14:44:57.15+00
f3f0b1b7-1b1b-437c-982c-56b87394e4ce	altoxv	sandwich	Parma	2	2026-05-28 14:32:23.754+00
c2669277-edb8-420a-8773-8c5b2b081391	altoxv	sandwich	Frango	2	2026-05-28 14:32:25.758+00
21b582db-fd13-450d-b014-455c9f24f729	altoxv	sandwich	Pernil	0	2026-05-28 14:32:28.404+00
85826a42-a656-4c1a-a641-29c93f588216	altoxv	sandwich	Mortadela	0	2026-05-30 14:31:03.568+00
f3af45f8-0f63-43be-ad8a-3d3f9e4a1e7b	altoxv	quiche	Caprese	0	2026-01-02 18:01:41.572+00
5f13a2c7-8423-46c6-bdb4-b3f346a12367	ahu	sandwich	Mortadela	12	2026-05-13 21:27:41.713+00
fb01f82a-7f66-487a-b86e-bb0cc5070a8b	altoxv	quiche	Lorraine	0	2026-01-02 18:01:42.01+00
288b53a4-7a81-47f6-80db-ed05e3359867	altoxv	quiche	Alho Poro	0	2026-02-17 14:52:24.783+00
9c118a6e-9d22-4429-a9b7-92a17dee0ed8	ahu	sandwich	Pernil	0	2026-05-30 14:54:37.167+00
74b36c97-4c18-42c8-a4f3-5dcc7a0ad9f7	batel	sandwich	Parma	3	2026-02-06 17:16:20.073+00
0b1d9ba6-bd74-4af9-bdab-5ae75d04b6c2	ahu	quiche	Alho Poro	0	2026-04-28 17:49:52.331+00
71d11c1c-a11e-4943-9c9a-ec6cf4cb5af8	batel	sandwich	Frango	5	2026-02-06 17:16:24.08+00
96c5ad13-7638-4677-bd20-9238ed8d4929	batel	sandwich	Carne	3	2026-02-06 20:02:16.146+00
2679a5ba-ee41-4e7a-8904-9087451e0b46	batel	sandwich	Pernil	3	2026-02-06 20:02:17.163+00
fa5e3908-9841-499d-9fea-bf5b6225e338	batel	sandwich	Mortadela	3	2026-02-06 20:02:17.92+00
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") FROM stdin;
\.


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_analytics" ("name", "type", "format", "created_at", "updated_at", "id", "deleted_at") FROM stdin;
\.


--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets_vectors" ("id", "type", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata", "metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."vector_indexes" ("id", "name", "bucket_id", "data_type", "dimension", "distance_metric", "metadata_configuration", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 908, true);


--
-- Name: Checklist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Checklist_id_seq"', 1952, true);


--
-- Name: Vales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Vales_id_seq"', 1315, true);


--
-- Name: Vouchers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."Vouchers_id_seq"', 18, true);


--
-- Name: frequencia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."frequencia_id_seq"', 235, true);


--
-- Name: historico_colaborador_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."historico_colaborador_id_seq"', 15, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict BD5ejA6e14yhnctwACh9es3kqyyfigoQcg4atEcLW7Adq3jQcfd9bMIhiq1ieF0

RESET ALL;
