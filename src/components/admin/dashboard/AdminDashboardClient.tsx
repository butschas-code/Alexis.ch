"use client";

import { useEffect, useState } from "react";
import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import {
  loadAdminDashboardAggregates,
  loadAdminDashboardLists,
  type AdminDashboardCounts,
  type AdminDashboardSitePostCounts,
} from "@/cms/services/dashboard-client";
import type { CmsPostListItem } from "@/cms/services/posts-client";
import type { SubmissionRow } from "@/cms/services/submissions-client";
import {
  AdminContentSkeleton,
  AdminDashboardSkeleton,
  AdminDashboardSummarySkeleton,
} from "@/components/admin/AdminLoading";
import { AdminPageContainer, AdminPageHeader, AdminPageSection } from "@/components/admin/AdminPageContainer";
import { DashboardQuickActions } from "./DashboardQuickActions";
import { DashboardRecentLists } from "./DashboardRecentLists";
import { DashboardSiteSplit } from "./DashboardSiteSplit";
import { DashboardSummaryCards } from "./DashboardSummaryCards";

function deferToNextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export function AdminDashboardClient() {
  const { roleReady, hasPermission } = useCmsAuth();
  const canManageSubmissions = hasPermission("manage_submissions");

  const [counts, setCounts] = useState<AdminDashboardCounts | null>(null);
  const [postsBySite, setPostsBySite] = useState<AdminDashboardSitePostCounts | null>(null);
  const [recentPosts, setRecentPosts] = useState<CmsPostListItem[] | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<SubmissionRow[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [aggError, setAggError] = useState<string | null>(null);

  useEffect(() => {
    if (!roleReady) return;

    let cancelled = false;
    setListError(null);
    setAggError(null);
    setCounts(null);
    setPostsBySite(null);
    setRecentPosts(null);
    setRecentSubmissions(null);

    const opts = {
      recentPostsLimit: 6,
      recentSubmissionsLimit: 6,
      includeSubmissionsIntake: canManageSubmissions,
    };

    const listP = loadAdminDashboardLists(opts);
    const aggP = loadAdminDashboardAggregates(opts);

    void (async () => {
      await deferToNextPaint();
      if (cancelled) return;

      listP
        .then((lists) => {
          if (cancelled) return;
          setRecentPosts(lists.recentPosts);
          setRecentSubmissions(lists.recentSubmissions);
        })
        .catch(() => {
          if (cancelled) return;
          setListError("Die Liste der letzten Beiträge konnte nicht geladen werden.");
        });

      aggP
        .then((agg) => {
          if (cancelled) return;
          setCounts(agg.counts);
          setPostsBySite(agg.postsBySite);
        })
        .catch(() => {
          if (cancelled) return;
          setAggError("Die Kennzahlen konnten nicht geladen werden.");
        });
    })();

    return () => {
      cancelled = true;
    };
  }, [roleReady, canManageSubmissions]);

  const listsReady = recentPosts !== null && recentSubmissions !== null;
  const aggReady = counts !== null && postsBySite !== null;
  const showFullSkeleton = !listsReady && !aggReady && !listError && !aggError;

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Übersicht"
        description="Kurzüberblick über Beiträge, Themen und Eingänge — gemeinsames CMS für abexis.ch und abexis-search.ch."
      />

      {listError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{listError}</div>
      ) : null}
      {aggError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{aggError}</div>
      ) : null}

      <AdminPageSection>
        <DashboardQuickActions showSubmissionsShortcut={canManageSubmissions} />
      </AdminPageSection>

      {showFullSkeleton ? (
        <AdminPageSection>
          <AdminDashboardSkeleton />
        </AdminPageSection>
      ) : (
        <>
          <AdminPageSection>
            {aggReady && counts && postsBySite ? (
              <>
                <DashboardSummaryCards counts={counts} showSubmissions={canManageSubmissions} />
                <div className="mt-8">
                  <DashboardSiteSplit postsBySite={postsBySite} />
                </div>
              </>
            ) : aggError ? (
              <p className="text-sm text-[var(--apple-text-secondary)]">
                Kennzahlen sind vorübergehend nicht verfügbar. Die Navigation oben bleibt nutzbar.
              </p>
            ) : (
              <>
                <AdminDashboardSummarySkeleton />
                <div className="mt-8">
                  <AdminContentSkeleton lines={2} />
                </div>
                <div className="mt-8 opacity-70">
                  <AdminContentSkeleton lines={2} />
                </div>
              </>
            )}
          </AdminPageSection>

          {!listError ? (
            <AdminPageSection>
              {listsReady && recentPosts && recentSubmissions ? (
                <DashboardRecentLists
                  posts={recentPosts}
                  submissions={recentSubmissions}
                  showSubmissions={canManageSubmissions}
                />
              ) : (
                <div className="grid gap-6 lg:grid-cols-2">
                  <AdminContentSkeleton lines={6} />
                  {canManageSubmissions ? <AdminContentSkeleton lines={6} /> : null}
                </div>
              )}
            </AdminPageSection>
          ) : null}
        </>
      )}
    </AdminPageContainer>
  );
}
