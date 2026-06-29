--
-- PostgreSQL database dump
--

\restrict t34JjK1aEqYCEBoJLQrZ3ErjgvOyrxZhYdvbrphQPgI0Ea66EFcdoZkyyPOuIOg

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4 (Ubuntu 18.4-1.pgdg24.04+1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: assistants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.assistants (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    style character varying(255) DEFAULT 'business'::character varying NOT NULL,
    brand_name character varying(255),
    phone character varying(255),
    social jsonb,
    fallback text,
    system text,
    welcome_message text,
    actions json,
    slug character varying(255),
    avatar character varying(255),
    background_image character varying(255)
);


--
-- Name: assistants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.assistants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: assistants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.assistants_id_seq OWNED BY public.assistants.id;


--
-- Name: billing_coupon_redemptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_coupon_redemptions (
    id bigint NOT NULL,
    billable_type character varying(255) NOT NULL,
    billable_id bigint NOT NULL,
    coupon_id bigint NOT NULL,
    promotion_code_id bigint,
    subscription_id bigint,
    invoice_id bigint,
    original_amount integer NOT NULL,
    discount_amount integer NOT NULL,
    final_amount integer NOT NULL,
    redeemed_at timestamp(0) without time zone NOT NULL,
    metadata json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: billing_coupon_redemptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.billing_coupon_redemptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: billing_coupon_redemptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.billing_coupon_redemptions_id_seq OWNED BY public.billing_coupon_redemptions.id;


--
-- Name: billing_coupons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_coupons (
    id bigint NOT NULL,
    ulid character(26) NOT NULL,
    name character varying(255) NOT NULL,
    discount_type character varying(255) NOT NULL,
    discount_value integer NOT NULL,
    currency character varying(3) DEFAULT 'KES'::character varying NOT NULL,
    duration character varying(255) NOT NULL,
    duration_in_months integer,
    max_redemptions integer,
    times_redeemed integer DEFAULT 0 NOT NULL,
    redeem_by timestamp(0) without time zone,
    is_active boolean DEFAULT true NOT NULL,
    applies_to_plans json,
    metadata json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: billing_coupons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.billing_coupons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: billing_coupons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.billing_coupons_id_seq OWNED BY public.billing_coupons.id;


--
-- Name: billing_features; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_features (
    id bigint NOT NULL,
    slug character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    category character varying(255),
    type character varying(255) DEFAULT 'boolean'::character varying NOT NULL,
    is_addon boolean DEFAULT false NOT NULL,
    addon_price integer,
    addon_billing_cycle character varying(255),
    is_active boolean DEFAULT true NOT NULL,
    metadata json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: billing_features_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.billing_features_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: billing_features_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.billing_features_id_seq OWNED BY public.billing_features.id;


--
-- Name: billing_invoice_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_invoice_items (
    id bigint NOT NULL,
    invoice_id bigint NOT NULL,
    description character varying(255) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    unit_price integer DEFAULT 0 NOT NULL,
    total integer DEFAULT 0 NOT NULL,
    feature_slug character varying(255),
    period_start timestamp(0) without time zone,
    period_end timestamp(0) without time zone,
    metadata json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: billing_invoice_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.billing_invoice_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: billing_invoice_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.billing_invoice_items_id_seq OWNED BY public.billing_invoice_items.id;


--
-- Name: billing_invoices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_invoices (
    id bigint NOT NULL,
    ulid character(26) NOT NULL,
    billable_type character varying(255) NOT NULL,
    billable_id bigint NOT NULL,
    subscription_id bigint,
    number character varying(255) NOT NULL,
    status character varying(255) DEFAULT 'draft'::character varying NOT NULL,
    subtotal integer DEFAULT 0 NOT NULL,
    tax_amount integer DEFAULT 0 NOT NULL,
    total integer DEFAULT 0 NOT NULL,
    currency character varying(3) DEFAULT 'KES'::character varying NOT NULL,
    tax_rate double precision DEFAULT '0'::double precision NOT NULL,
    due_date date,
    paid_at timestamp(0) without time zone,
    metadata json,
    notes text,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: billing_invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.billing_invoices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: billing_invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.billing_invoices_id_seq OWNED BY public.billing_invoices.id;


--
-- Name: billing_payment_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_payment_tokens (
    id bigint NOT NULL,
    ulid character(26) NOT NULL,
    billable_type character varying(255) NOT NULL,
    billable_id bigint NOT NULL,
    provider character varying(255) NOT NULL,
    token_type character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    last_four character varying(4),
    card_brand character varying(255),
    card_exp_month character varying(2),
    card_exp_year character varying(4),
    bank_name character varying(255),
    phone character varying(255),
    email character varying(255),
    is_default boolean DEFAULT false NOT NULL,
    is_reusable boolean DEFAULT true NOT NULL,
    expires_at timestamp(0) without time zone,
    last_used_at timestamp(0) without time zone,
    metadata json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: billing_payment_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.billing_payment_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: billing_payment_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.billing_payment_tokens_id_seq OWNED BY public.billing_payment_tokens.id;


--
-- Name: billing_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_payments (
    id bigint NOT NULL,
    ulid character(26) NOT NULL,
    billable_type character varying(255) NOT NULL,
    billable_id bigint NOT NULL,
    subscription_id bigint,
    invoice_id bigint,
    amount integer NOT NULL,
    currency character varying(3) DEFAULT 'KES'::character varying NOT NULL,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    payment_provider character varying(255),
    provider_payment_id character varying(255),
    provider_reference character varying(255),
    payment_method character varying(255),
    metadata json,
    paid_at timestamp(0) without time zone,
    failed_at timestamp(0) without time zone,
    refunded_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: billing_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.billing_payments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: billing_payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.billing_payments_id_seq OWNED BY public.billing_payments.id;


--
-- Name: billing_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_plans (
    id bigint NOT NULL,
    ulid character(26) NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    description text,
    base_price integer DEFAULT 0 NOT NULL,
    currency character varying(3) DEFAULT 'KES'::character varying NOT NULL,
    billing_cycle character varying(255) DEFAULT 'monthly'::character varying NOT NULL,
    trial_days integer,
    is_active boolean DEFAULT true NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    features json,
    limits json,
    metadata json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: billing_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.billing_plans_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: billing_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.billing_plans_id_seq OWNED BY public.billing_plans.id;


--
-- Name: billing_promotion_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_promotion_codes (
    id bigint NOT NULL,
    code character varying(255) NOT NULL,
    coupon_id bigint NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    first_time_transaction boolean DEFAULT false NOT NULL,
    minimum_amount integer,
    minimum_amount_currency character varying(3),
    max_redemptions integer,
    times_redeemed integer DEFAULT 0 NOT NULL,
    expires_at timestamp(0) without time zone,
    metadata json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: billing_promotion_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.billing_promotion_codes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: billing_promotion_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.billing_promotion_codes_id_seq OWNED BY public.billing_promotion_codes.id;


--
-- Name: billing_subscription_addons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_subscription_addons (
    id bigint NOT NULL,
    subscription_id bigint NOT NULL,
    feature_id bigint NOT NULL,
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    price_override integer,
    enabled_at timestamp(0) without time zone,
    disabled_at timestamp(0) without time zone,
    provider_addon_id character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: billing_subscription_addons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.billing_subscription_addons_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: billing_subscription_addons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.billing_subscription_addons_id_seq OWNED BY public.billing_subscription_addons.id;


--
-- Name: billing_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_subscriptions (
    id bigint NOT NULL,
    ulid character(26) NOT NULL,
    billable_type character varying(255) NOT NULL,
    billable_id bigint NOT NULL,
    plan_id bigint NOT NULL,
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    trial_ends_at timestamp(0) without time zone,
    current_period_start timestamp(0) without time zone,
    current_period_end timestamp(0) without time zone,
    cancelled_at timestamp(0) without time zone,
    paused_at timestamp(0) without time zone,
    resumed_at timestamp(0) without time zone,
    payment_provider character varying(255),
    provider_subscription_id character varying(255),
    metadata json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: billing_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.billing_subscriptions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: billing_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.billing_subscriptions_id_seq OWNED BY public.billing_subscriptions.id;


--
-- Name: billing_usage_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_usage_events (
    id bigint NOT NULL,
    ulid character(26) NOT NULL,
    billable_type character varying(255) NOT NULL,
    billable_id bigint NOT NULL,
    feature_slug character varying(255) NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    transaction_id character varying(255),
    properties json,
    recorded_at timestamp(0) without time zone NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: billing_usage_events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.billing_usage_events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: billing_usage_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.billing_usage_events_id_seq OWNED BY public.billing_usage_events.id;


--
-- Name: billing_usage_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_usage_records (
    id bigint NOT NULL,
    ulid character(26) NOT NULL,
    billable_type character varying(255) NOT NULL,
    billable_id bigint NOT NULL,
    feature_slug character varying(255) NOT NULL,
    period_start timestamp(0) without time zone NOT NULL,
    period_end timestamp(0) without time zone NOT NULL,
    usage_count integer DEFAULT 0 NOT NULL,
    usage_limit integer,
    overage_count integer DEFAULT 0 NOT NULL,
    metadata json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: billing_usage_records_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.billing_usage_records_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: billing_usage_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.billing_usage_records_id_seq OWNED BY public.billing_usage_records.id;


--
-- Name: cache; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration bigint NOT NULL
);


--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration bigint NOT NULL
);


--
-- Name: chat_histories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat_histories (
    id bigint NOT NULL,
    assistant_id bigint NOT NULL,
    user_id bigint,
    question text NOT NULL,
    answer text NOT NULL,
    sources json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    session_id character varying(255)
);


--
-- Name: chat_histories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chat_histories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chat_histories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chat_histories_id_seq OWNED BY public.chat_histories.id;


--
-- Name: chunks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chunks (
    id bigint NOT NULL,
    assistant_id bigint NOT NULL,
    qdrant_id uuid,
    content text NOT NULL,
    metadata json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    knowledge_id bigint
);


--
-- Name: chunks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.chunks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chunks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.chunks_id_seq OWNED BY public.chunks.id;


--
-- Name: connector_assistants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.connector_assistants (
    id bigint NOT NULL,
    connector_id bigint NOT NULL,
    assistant_id bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: connector_assistants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.connector_assistants_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: connector_assistants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.connector_assistants_id_seq OWNED BY public.connector_assistants.id;


--
-- Name: connector_contents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.connector_contents (
    id bigint NOT NULL,
    connector_id bigint NOT NULL,
    text text NOT NULL,
    status character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: connector_contents_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.connector_contents_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: connector_contents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.connector_contents_id_seq OWNED BY public.connector_contents.id;


--
-- Name: connectors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.connectors (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    icon character varying(255),
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    settings json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: connectors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.connectors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: connectors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.connectors_id_seq OWNED BY public.connectors.id;


--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection character varying(255) NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);


--
-- Name: jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: knowledge; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knowledge (
    id bigint NOT NULL,
    assistant_id bigint NOT NULL,
    type character varying(255) NOT NULL,
    name character varying(255),
    url character varying(255),
    path character varying(255),
    content text,
    status character varying(255) DEFAULT 'pending'::character varying NOT NULL,
    metadata json,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: knowledge_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.knowledge_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: knowledge_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.knowledge_id_seq OWNED BY public.knowledge.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


--
-- Name: personal_access_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.personal_access_tokens (
    id bigint NOT NULL,
    tokenable_type character varying(255) NOT NULL,
    tokenable_id bigint NOT NULL,
    name text NOT NULL,
    token character varying(64) NOT NULL,
    abilities text,
    last_used_at timestamp(0) without time zone,
    expires_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.personal_access_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: personal_access_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.personal_access_tokens_id_seq OWNED BY public.personal_access_tokens.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    balance numeric(15,2) DEFAULT '0'::numeric NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: assistants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assistants ALTER COLUMN id SET DEFAULT nextval('public.assistants_id_seq'::regclass);


--
-- Name: billing_coupon_redemptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_coupon_redemptions ALTER COLUMN id SET DEFAULT nextval('public.billing_coupon_redemptions_id_seq'::regclass);


--
-- Name: billing_coupons id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_coupons ALTER COLUMN id SET DEFAULT nextval('public.billing_coupons_id_seq'::regclass);


--
-- Name: billing_features id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_features ALTER COLUMN id SET DEFAULT nextval('public.billing_features_id_seq'::regclass);


--
-- Name: billing_invoice_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoice_items ALTER COLUMN id SET DEFAULT nextval('public.billing_invoice_items_id_seq'::regclass);


--
-- Name: billing_invoices id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoices ALTER COLUMN id SET DEFAULT nextval('public.billing_invoices_id_seq'::regclass);


--
-- Name: billing_payment_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_payment_tokens ALTER COLUMN id SET DEFAULT nextval('public.billing_payment_tokens_id_seq'::regclass);


--
-- Name: billing_payments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_payments ALTER COLUMN id SET DEFAULT nextval('public.billing_payments_id_seq'::regclass);


--
-- Name: billing_plans id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_plans ALTER COLUMN id SET DEFAULT nextval('public.billing_plans_id_seq'::regclass);


--
-- Name: billing_promotion_codes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_promotion_codes ALTER COLUMN id SET DEFAULT nextval('public.billing_promotion_codes_id_seq'::regclass);


--
-- Name: billing_subscription_addons id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_subscription_addons ALTER COLUMN id SET DEFAULT nextval('public.billing_subscription_addons_id_seq'::regclass);


--
-- Name: billing_subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.billing_subscriptions_id_seq'::regclass);


--
-- Name: billing_usage_events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_usage_events ALTER COLUMN id SET DEFAULT nextval('public.billing_usage_events_id_seq'::regclass);


--
-- Name: billing_usage_records id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_usage_records ALTER COLUMN id SET DEFAULT nextval('public.billing_usage_records_id_seq'::regclass);


--
-- Name: chat_histories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_histories ALTER COLUMN id SET DEFAULT nextval('public.chat_histories_id_seq'::regclass);


--
-- Name: chunks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chunks ALTER COLUMN id SET DEFAULT nextval('public.chunks_id_seq'::regclass);


--
-- Name: connector_assistants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connector_assistants ALTER COLUMN id SET DEFAULT nextval('public.connector_assistants_id_seq'::regclass);


--
-- Name: connector_contents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connector_contents ALTER COLUMN id SET DEFAULT nextval('public.connector_contents_id_seq'::regclass);


--
-- Name: connectors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connectors ALTER COLUMN id SET DEFAULT nextval('public.connectors_id_seq'::regclass);


--
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: knowledge id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge ALTER COLUMN id SET DEFAULT nextval('public.knowledge_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: personal_access_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_access_tokens ALTER COLUMN id SET DEFAULT nextval('public.personal_access_tokens_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: assistants assistants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assistants
    ADD CONSTRAINT assistants_pkey PRIMARY KEY (id);


--
-- Name: assistants assistants_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assistants
    ADD CONSTRAINT assistants_slug_unique UNIQUE (slug);


--
-- Name: billing_coupon_redemptions billing_coupon_redemptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_coupon_redemptions
    ADD CONSTRAINT billing_coupon_redemptions_pkey PRIMARY KEY (id);


--
-- Name: billing_coupons billing_coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_coupons
    ADD CONSTRAINT billing_coupons_pkey PRIMARY KEY (id);


--
-- Name: billing_coupons billing_coupons_ulid_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_coupons
    ADD CONSTRAINT billing_coupons_ulid_unique UNIQUE (ulid);


--
-- Name: billing_features billing_features_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_features
    ADD CONSTRAINT billing_features_pkey PRIMARY KEY (id);


--
-- Name: billing_features billing_features_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_features
    ADD CONSTRAINT billing_features_slug_unique UNIQUE (slug);


--
-- Name: billing_invoice_items billing_invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoice_items
    ADD CONSTRAINT billing_invoice_items_pkey PRIMARY KEY (id);


--
-- Name: billing_invoices billing_invoices_number_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoices
    ADD CONSTRAINT billing_invoices_number_unique UNIQUE (number);


--
-- Name: billing_invoices billing_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoices
    ADD CONSTRAINT billing_invoices_pkey PRIMARY KEY (id);


--
-- Name: billing_invoices billing_invoices_ulid_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoices
    ADD CONSTRAINT billing_invoices_ulid_unique UNIQUE (ulid);


--
-- Name: billing_payment_tokens billing_payment_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_payment_tokens
    ADD CONSTRAINT billing_payment_tokens_pkey PRIMARY KEY (id);


--
-- Name: billing_payment_tokens billing_payment_tokens_ulid_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_payment_tokens
    ADD CONSTRAINT billing_payment_tokens_ulid_unique UNIQUE (ulid);


--
-- Name: billing_payments billing_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_payments
    ADD CONSTRAINT billing_payments_pkey PRIMARY KEY (id);


--
-- Name: billing_payments billing_payments_ulid_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_payments
    ADD CONSTRAINT billing_payments_ulid_unique UNIQUE (ulid);


--
-- Name: billing_plans billing_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_plans
    ADD CONSTRAINT billing_plans_pkey PRIMARY KEY (id);


--
-- Name: billing_plans billing_plans_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_plans
    ADD CONSTRAINT billing_plans_slug_unique UNIQUE (slug);


--
-- Name: billing_plans billing_plans_ulid_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_plans
    ADD CONSTRAINT billing_plans_ulid_unique UNIQUE (ulid);


--
-- Name: billing_promotion_codes billing_promotion_codes_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_promotion_codes
    ADD CONSTRAINT billing_promotion_codes_code_unique UNIQUE (code);


--
-- Name: billing_promotion_codes billing_promotion_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_promotion_codes
    ADD CONSTRAINT billing_promotion_codes_pkey PRIMARY KEY (id);


--
-- Name: billing_subscription_addons billing_subscription_addons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_subscription_addons
    ADD CONSTRAINT billing_subscription_addons_pkey PRIMARY KEY (id);


--
-- Name: billing_subscription_addons billing_subscription_addons_subscription_id_feature_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_subscription_addons
    ADD CONSTRAINT billing_subscription_addons_subscription_id_feature_id_unique UNIQUE (subscription_id, feature_id);


--
-- Name: billing_subscriptions billing_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_subscriptions
    ADD CONSTRAINT billing_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: billing_subscriptions billing_subscriptions_ulid_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_subscriptions
    ADD CONSTRAINT billing_subscriptions_ulid_unique UNIQUE (ulid);


--
-- Name: billing_usage_events billing_usage_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_usage_events
    ADD CONSTRAINT billing_usage_events_pkey PRIMARY KEY (id);


--
-- Name: billing_usage_events billing_usage_events_transaction_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_usage_events
    ADD CONSTRAINT billing_usage_events_transaction_id_unique UNIQUE (transaction_id);


--
-- Name: billing_usage_events billing_usage_events_ulid_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_usage_events
    ADD CONSTRAINT billing_usage_events_ulid_unique UNIQUE (ulid);


--
-- Name: billing_usage_records billing_usage_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_usage_records
    ADD CONSTRAINT billing_usage_records_pkey PRIMARY KEY (id);


--
-- Name: billing_usage_records billing_usage_records_ulid_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_usage_records
    ADD CONSTRAINT billing_usage_records_ulid_unique UNIQUE (ulid);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: chat_histories chat_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_histories
    ADD CONSTRAINT chat_histories_pkey PRIMARY KEY (id);


--
-- Name: chunks chunks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chunks
    ADD CONSTRAINT chunks_pkey PRIMARY KEY (id);


--
-- Name: connector_assistants connector_assistants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connector_assistants
    ADD CONSTRAINT connector_assistants_pkey PRIMARY KEY (id);


--
-- Name: connector_contents connector_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connector_contents
    ADD CONSTRAINT connector_contents_pkey PRIMARY KEY (id);


--
-- Name: connectors connectors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connectors
    ADD CONSTRAINT connectors_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: knowledge knowledge_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge
    ADD CONSTRAINT knowledge_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- Name: personal_access_tokens personal_access_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_pkey PRIMARY KEY (id);


--
-- Name: personal_access_tokens personal_access_tokens_token_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personal_access_tokens
    ADD CONSTRAINT personal_access_tokens_token_unique UNIQUE (token);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: billing_coupon_redemptions_billable_type_billable_id_coupon_id_; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_coupon_redemptions_billable_type_billable_id_coupon_id_ ON public.billing_coupon_redemptions USING btree (billable_type, billable_id, coupon_id);


--
-- Name: billing_coupon_redemptions_billable_type_billable_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_coupon_redemptions_billable_type_billable_id_index ON public.billing_coupon_redemptions USING btree (billable_type, billable_id);


--
-- Name: billing_coupons_is_active_redeem_by_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_coupons_is_active_redeem_by_index ON public.billing_coupons USING btree (is_active, redeem_by);


--
-- Name: billing_features_category_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_features_category_index ON public.billing_features USING btree (category);


--
-- Name: billing_features_is_active_is_addon_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_features_is_active_is_addon_index ON public.billing_features USING btree (is_active, is_addon);


--
-- Name: billing_invoices_billable_type_billable_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_invoices_billable_type_billable_id_index ON public.billing_invoices USING btree (billable_type, billable_id);


--
-- Name: billing_invoices_billable_type_billable_id_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_invoices_billable_type_billable_id_status_index ON public.billing_invoices USING btree (billable_type, billable_id, status);


--
-- Name: billing_invoices_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_invoices_status_index ON public.billing_invoices USING btree (status);


--
-- Name: billing_payment_tokens_billable_type_billable_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_payment_tokens_billable_type_billable_id_index ON public.billing_payment_tokens USING btree (billable_type, billable_id);


--
-- Name: billing_payment_tokens_billable_type_billable_id_is_default_ind; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_payment_tokens_billable_type_billable_id_is_default_ind ON public.billing_payment_tokens USING btree (billable_type, billable_id, is_default);


--
-- Name: billing_payment_tokens_billable_type_billable_id_provider_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_payment_tokens_billable_type_billable_id_provider_index ON public.billing_payment_tokens USING btree (billable_type, billable_id, provider);


--
-- Name: billing_payments_billable_type_billable_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_payments_billable_type_billable_id_index ON public.billing_payments USING btree (billable_type, billable_id);


--
-- Name: billing_payments_billable_type_billable_id_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_payments_billable_type_billable_id_status_index ON public.billing_payments USING btree (billable_type, billable_id, status);


--
-- Name: billing_payments_provider_payment_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_payments_provider_payment_id_index ON public.billing_payments USING btree (provider_payment_id);


--
-- Name: billing_payments_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_payments_status_index ON public.billing_payments USING btree (status);


--
-- Name: billing_plans_is_active_sort_order_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_plans_is_active_sort_order_index ON public.billing_plans USING btree (is_active, sort_order);


--
-- Name: billing_promotion_codes_is_active_expires_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_promotion_codes_is_active_expires_at_index ON public.billing_promotion_codes USING btree (is_active, expires_at);


--
-- Name: billing_subscription_addons_subscription_id_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_subscription_addons_subscription_id_status_index ON public.billing_subscription_addons USING btree (subscription_id, status);


--
-- Name: billing_subscriptions_billable_type_billable_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_subscriptions_billable_type_billable_id_index ON public.billing_subscriptions USING btree (billable_type, billable_id);


--
-- Name: billing_subscriptions_billable_type_billable_id_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_subscriptions_billable_type_billable_id_status_index ON public.billing_subscriptions USING btree (billable_type, billable_id, status);


--
-- Name: billing_subscriptions_provider_subscription_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_subscriptions_provider_subscription_id_index ON public.billing_subscriptions USING btree (provider_subscription_id);


--
-- Name: billing_subscriptions_status_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_subscriptions_status_index ON public.billing_subscriptions USING btree (status);


--
-- Name: billing_usage_events_billable_type_billable_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_usage_events_billable_type_billable_id_index ON public.billing_usage_events USING btree (billable_type, billable_id);


--
-- Name: billing_usage_events_feature_slug_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_usage_events_feature_slug_index ON public.billing_usage_events USING btree (feature_slug);


--
-- Name: billing_usage_records_billable_type_billable_id_feature_slug_in; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_usage_records_billable_type_billable_id_feature_slug_in ON public.billing_usage_records USING btree (billable_type, billable_id, feature_slug);


--
-- Name: billing_usage_records_billable_type_billable_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_usage_records_billable_type_billable_id_index ON public.billing_usage_records USING btree (billable_type, billable_id);


--
-- Name: billing_usage_records_feature_slug_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_usage_records_feature_slug_index ON public.billing_usage_records USING btree (feature_slug);


--
-- Name: billing_usage_records_period_start_period_end_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX billing_usage_records_period_start_period_end_index ON public.billing_usage_records USING btree (period_start, period_end);


--
-- Name: cache_expiration_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cache_expiration_index ON public.cache USING btree (expiration);


--
-- Name: cache_locks_expiration_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX cache_locks_expiration_index ON public.cache_locks USING btree (expiration);


--
-- Name: failed_jobs_connection_queue_failed_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX failed_jobs_connection_queue_failed_at_index ON public.failed_jobs USING btree (connection, queue, failed_at);


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: personal_access_tokens_expires_at_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX personal_access_tokens_expires_at_index ON public.personal_access_tokens USING btree (expires_at);


--
-- Name: personal_access_tokens_tokenable_type_tokenable_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON public.personal_access_tokens USING btree (tokenable_type, tokenable_id);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: usage_events_billable_feature_recorded; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX usage_events_billable_feature_recorded ON public.billing_usage_events USING btree (billable_type, billable_id, feature_slug, recorded_at);


--
-- Name: assistants assistants_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.assistants
    ADD CONSTRAINT assistants_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: billing_coupon_redemptions billing_coupon_redemptions_coupon_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_coupon_redemptions
    ADD CONSTRAINT billing_coupon_redemptions_coupon_id_foreign FOREIGN KEY (coupon_id) REFERENCES public.billing_coupons(id);


--
-- Name: billing_coupon_redemptions billing_coupon_redemptions_invoice_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_coupon_redemptions
    ADD CONSTRAINT billing_coupon_redemptions_invoice_id_foreign FOREIGN KEY (invoice_id) REFERENCES public.billing_invoices(id) ON DELETE SET NULL;


--
-- Name: billing_coupon_redemptions billing_coupon_redemptions_promotion_code_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_coupon_redemptions
    ADD CONSTRAINT billing_coupon_redemptions_promotion_code_id_foreign FOREIGN KEY (promotion_code_id) REFERENCES public.billing_promotion_codes(id);


--
-- Name: billing_coupon_redemptions billing_coupon_redemptions_subscription_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_coupon_redemptions
    ADD CONSTRAINT billing_coupon_redemptions_subscription_id_foreign FOREIGN KEY (subscription_id) REFERENCES public.billing_subscriptions(id) ON DELETE SET NULL;


--
-- Name: billing_invoice_items billing_invoice_items_invoice_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoice_items
    ADD CONSTRAINT billing_invoice_items_invoice_id_foreign FOREIGN KEY (invoice_id) REFERENCES public.billing_invoices(id) ON DELETE CASCADE;


--
-- Name: billing_invoices billing_invoices_subscription_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_invoices
    ADD CONSTRAINT billing_invoices_subscription_id_foreign FOREIGN KEY (subscription_id) REFERENCES public.billing_subscriptions(id) ON DELETE SET NULL;


--
-- Name: billing_payments billing_payments_invoice_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_payments
    ADD CONSTRAINT billing_payments_invoice_id_foreign FOREIGN KEY (invoice_id) REFERENCES public.billing_invoices(id) ON DELETE SET NULL;


--
-- Name: billing_payments billing_payments_subscription_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_payments
    ADD CONSTRAINT billing_payments_subscription_id_foreign FOREIGN KEY (subscription_id) REFERENCES public.billing_subscriptions(id) ON DELETE SET NULL;


--
-- Name: billing_promotion_codes billing_promotion_codes_coupon_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_promotion_codes
    ADD CONSTRAINT billing_promotion_codes_coupon_id_foreign FOREIGN KEY (coupon_id) REFERENCES public.billing_coupons(id);


--
-- Name: billing_subscription_addons billing_subscription_addons_feature_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_subscription_addons
    ADD CONSTRAINT billing_subscription_addons_feature_id_foreign FOREIGN KEY (feature_id) REFERENCES public.billing_features(id);


--
-- Name: billing_subscription_addons billing_subscription_addons_subscription_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_subscription_addons
    ADD CONSTRAINT billing_subscription_addons_subscription_id_foreign FOREIGN KEY (subscription_id) REFERENCES public.billing_subscriptions(id) ON DELETE CASCADE;


--
-- Name: billing_subscriptions billing_subscriptions_plan_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_subscriptions
    ADD CONSTRAINT billing_subscriptions_plan_id_foreign FOREIGN KEY (plan_id) REFERENCES public.billing_plans(id);


--
-- Name: chat_histories chat_histories_assistant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_histories
    ADD CONSTRAINT chat_histories_assistant_id_foreign FOREIGN KEY (assistant_id) REFERENCES public.assistants(id) ON DELETE CASCADE;


--
-- Name: chat_histories chat_histories_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat_histories
    ADD CONSTRAINT chat_histories_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: chunks chunks_assistant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chunks
    ADD CONSTRAINT chunks_assistant_id_foreign FOREIGN KEY (assistant_id) REFERENCES public.assistants(id) ON DELETE CASCADE;


--
-- Name: chunks chunks_knowledge_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chunks
    ADD CONSTRAINT chunks_knowledge_id_foreign FOREIGN KEY (knowledge_id) REFERENCES public.knowledge(id) ON DELETE CASCADE;


--
-- Name: connector_assistants connector_assistants_assistant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connector_assistants
    ADD CONSTRAINT connector_assistants_assistant_id_foreign FOREIGN KEY (assistant_id) REFERENCES public.assistants(id) ON DELETE CASCADE;


--
-- Name: connector_assistants connector_assistants_connector_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connector_assistants
    ADD CONSTRAINT connector_assistants_connector_id_foreign FOREIGN KEY (connector_id) REFERENCES public.connectors(id) ON DELETE CASCADE;


--
-- Name: connector_contents connector_contents_connector_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connector_contents
    ADD CONSTRAINT connector_contents_connector_id_foreign FOREIGN KEY (connector_id) REFERENCES public.connectors(id) ON DELETE CASCADE;


--
-- Name: knowledge knowledge_assistant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knowledge
    ADD CONSTRAINT knowledge_assistant_id_foreign FOREIGN KEY (assistant_id) REFERENCES public.assistants(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict t34JjK1aEqYCEBoJLQrZ3ErjgvOyrxZhYdvbrphQPgI0Ea66EFcdoZkyyPOuIOg

--
-- PostgreSQL database dump
--

\restrict fVINcLF8rirOiN1kVKSVY2gS77KAfguG3ICmMCgo68KPnim95w1wrRInRnJHvYN

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4 (Ubuntu 18.4-1.pgdg24.04+1)

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
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	0001_01_01_000000_create_users_table	1
2	0001_01_01_000001_create_cache_table	1
3	0001_01_01_000002_create_jobs_table	1
4	2026_06_25_183346_create_assistants_table	1
5	2026_06_25_183349_create_chunks_table	1
6	2026_06_25_183355_create_chat_histories_table	1
7	2026_06_25_213936_create_knowledge_table	1
8	2026_06_25_213937_add_knowledge_id_to_chunks_table	1
9	2026_06_26_084029_add_details_to_assistants_table	1
10	2026_06_26_125001_add_system_prompt_to_assistants_table	1
11	2026_06_26_152723_add_welcome_message_to_assistants_table	1
12	2026_06_26_153252_add_actions_to_assistants_table	1
13	2026_06_27_054420_create_personal_access_tokens_table	1
14	2026_06_27_113100_create_connectors_table	1
15	2026_06_27_113106_create_connector_assistants_table	1
16	2026_06_27_113106_create_connector_contents_table	1
17	2026_06_28_091648_add_slug_to_assistants_table	1
18	2026_06_28_134050_add_appearance_to_assistants_table	1
19	2026_06_28_180937_create_billing_plans_table	1
20	2026_06_28_180938_create_billing_features_table	1
21	2026_06_28_180939_create_billing_subscriptions_table	1
22	2026_06_28_180940_create_billing_subscription_addons_table	1
23	2026_06_28_180941_create_billing_usage_records_table	1
24	2026_06_28_180942_create_billing_usage_events_table	1
25	2026_06_28_180944_create_billing_invoices_table	1
26	2026_06_28_180945_create_billing_invoice_items_table	1
27	2026_06_28_180946_create_billing_coupons_table	1
28	2026_06_28_180947_create_billing_promotion_codes_table	1
29	2026_06_28_180948_create_billing_coupon_redemptions_table	1
30	2026_06_28_180949_create_billing_payment_tokens_table	1
31	2026_06_28_180950_create_billing_payments_table	1
32	2026_06_28_181034_add_balance_to_users_table	1
33	2026_06_29_175141_make_user_id_nullable_in_chat_histories_table	1
34	2026_06_29_175142_add_session_id_to_chat_histories_table	1
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.migrations_id_seq', 34, true);


--
-- PostgreSQL database dump complete
--

\unrestrict fVINcLF8rirOiN1kVKSVY2gS77KAfguG3ICmMCgo68KPnim95w1wrRInRnJHvYN

