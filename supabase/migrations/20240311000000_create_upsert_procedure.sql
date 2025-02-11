
CREATE OR REPLACE FUNCTION upsert_ebay_listings(listings jsonb[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    FOR i IN 1..array_length(listings, 1) LOOP
        INSERT INTO ebay_listings (
            user_id,
            file_name,
            import_batch_id,
            data_start_date,
            data_end_date,
            listing_title,
            ebay_item_id,
            total_impressions_ebay,
            click_through_rate,
            quantity_sold,
            sales_conversion_rate,
            top_20_search_slot_promoted_impressions,
            change_top_20_search_slot_promoted_impressions,
            top_20_search_slot_organic_impressions,
            change_top_20_search_slot_impressions,
            rest_of_search_slot_impressions,
            non_search_promoted_listings_impressions,
            change_non_search_promoted_listings_impressions,
            non_search_organic_impressions,
            change_non_search_organic_impressions,
            total_promoted_listings_impressions,
            total_organic_impressions_ebay,
            total_page_views,
            page_views_promoted_ebay,
            page_views_promoted_outside_ebay,
            page_views_organic_ebay,
            page_views_organic_outside_ebay
        )
        VALUES (
            (listings[i]->>'user_id')::uuid,
            listings[i]->>'file_name',
            (listings[i]->>'import_batch_id')::uuid,
            (listings[i]->>'data_start_date')::timestamp with time zone,
            (listings[i]->>'data_end_date')::timestamp with time zone,
            listings[i]->>'listing_title',
            listings[i]->>'ebay_item_id',
            (listings[i]->>'total_impressions_ebay')::numeric,
            (listings[i]->>'click_through_rate')::numeric,
            (listings[i]->>'quantity_sold')::numeric,
            (listings[i]->>'sales_conversion_rate')::numeric,
            (listings[i]->>'top_20_search_slot_promoted_impressions')::numeric,
            (listings[i]->>'change_top_20_search_slot_promoted_impressions')::numeric,
            (listings[i]->>'top_20_search_slot_organic_impressions')::numeric,
            (listings[i]->>'change_top_20_search_slot_impressions')::numeric,
            (listings[i]->>'rest_of_search_slot_impressions')::numeric,
            (listings[i]->>'non_search_promoted_listings_impressions')::numeric,
            (listings[i]->>'change_non_search_promoted_listings_impressions')::numeric,
            (listings[i]->>'non_search_organic_impressions')::numeric,
            (listings[i]->>'change_non_search_organic_impressions')::numeric,
            (listings[i]->>'total_promoted_listings_impressions')::numeric,
            (listings[i]->>'total_organic_impressions_ebay')::numeric,
            (listings[i]->>'total_page_views')::numeric,
            (listings[i]->>'page_views_promoted_ebay')::numeric,
            (listings[i]->>'page_views_promoted_outside_ebay')::numeric,
            (listings[i]->>'page_views_organic_ebay')::numeric,
            (listings[i]->>'page_views_organic_outside_ebay')::numeric
        )
        ON CONFLICT (user_id, ebay_item_id, data_start_date, data_end_date)
        DO UPDATE SET
            total_impressions_ebay = EXCLUDED.total_impressions_ebay,
            click_through_rate = EXCLUDED.click_through_rate,
            quantity_sold = EXCLUDED.quantity_sold,
            sales_conversion_rate = EXCLUDED.sales_conversion_rate,
            top_20_search_slot_promoted_impressions = EXCLUDED.top_20_search_slot_promoted_impressions,
            change_top_20_search_slot_promoted_impressions = EXCLUDED.change_top_20_search_slot_promoted_impressions,
            top_20_search_slot_organic_impressions = EXCLUDED.top_20_search_slot_organic_impressions,
            change_top_20_search_slot_impressions = EXCLUDED.change_top_20_search_slot_impressions,
            rest_of_search_slot_impressions = EXCLUDED.rest_of_search_slot_impressions,
            non_search_promoted_listings_impressions = EXCLUDED.non_search_promoted_listings_impressions,
            change_non_search_promoted_listings_impressions = EXCLUDED.change_non_search_promoted_listings_impressions,
            non_search_organic_impressions = EXCLUDED.non_search_organic_impressions,
            change_non_search_organic_impressions = EXCLUDED.change_non_search_organic_impressions,
            total_promoted_listings_impressions = EXCLUDED.total_promoted_listings_impressions,
            total_organic_impressions_ebay = EXCLUDED.total_organic_impressions_ebay,
            total_page_views = EXCLUDED.total_page_views,
            page_views_promoted_ebay = EXCLUDED.page_views_promoted_ebay,
            page_views_promoted_outside_ebay = EXCLUDED.page_views_promoted_outside_ebay,
            page_views_organic_ebay = EXCLUDED.page_views_organic_ebay,
            page_views_organic_outside_ebay = EXCLUDED.page_views_organic_outside_ebay,
            updated_at = NOW();
    END LOOP;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION upsert_ebay_listings TO authenticated;
