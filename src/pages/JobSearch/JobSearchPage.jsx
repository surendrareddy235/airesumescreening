import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NeuralMatchCard from './NeuralMatchCard';
import { listAllJobs, searchJobsAfterEdit } from './jobSearchApi';

export default function JobSearchPage() {
  const routerLocation = useLocation();

  // Job Feed State
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter State
  const [minScore, setMinScore] = useState(50);
  const [roleSimilarity, setRoleSimilarity] = useState(60);
  const [location, setLocation] = useState("");
  const [maxExp, setMaxExp] = useState(5);
  
  // Load initial jobs
  useEffect(() => {
    if (routerLocation.state?.performSearch) {
      // Need a way to call it without using the stale state, or we just call the API directly
      performInitialSearch();
    } else {
      fetchAllJobs();
    }
  }, []);

  const performInitialSearch = async () => {
    setIsLoadingJobs(true);
    setError(null);
    try {
      const params = {
        min_score: 50,
        min_role_similarity: 60,
      };
      const results = await searchJobsAfterEdit(params);
      setJobs(results.jobs || results.match_results?.jobs || []);
    } catch (err) {
      fetchAllJobs();
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const fetchAllJobs = async () => {
    setIsLoadingJobs(true);
    setError(null);
    try {
      const fetched = await listAllJobs(0, 50);
      setJobs(fetched.items || []);
    } catch (err) {
      setError(err.message || "Failed to load jobs.");
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const handleApplyFilters = async () => {
    setIsLoadingJobs(true);
    setError(null);
    try {
      const params = {
        min_score: minScore,
        min_role_similarity: roleSimilarity,
      };
      if (location) params.location = location;
      if (maxExp) params.experience = parseFloat(maxExp);
      
      try {
        const results = await searchJobsAfterEdit(params);
        setJobs(results.jobs || results.match_results?.jobs || []);
      } catch (searchErr) {
        // Fallback: If session not found, just fetch all jobs and filter locally
        const all = await listAllJobs(0, 50);
        let filtered = all.items;
        if (location) {
          filtered = filtered.filter(j => j.location && j.location.toLowerCase().includes(location.toLowerCase()));
        }
        if (maxExp) {
          filtered = filtered.filter(j => !j.required_experience || j.required_experience <= parseFloat(maxExp));
        }
        setJobs(filtered);
      }
    } catch (err) {
      setError(err.message || "Failed to apply filters.");
    } finally {
      setIsLoadingJobs(false);
    }
  };

  return (
    <main className="p-md md:p-gutter max-w-[1440px] mx-auto w-full">
      <div className="mb-lg pt-4 md:pt-0">
        <h2 className="font-headline-md text-headline-md text-on-background font-bold text-primary">Job Matcher</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">Fine-tune your criteria to find the perfect neural match.</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-error-container text-on-error-container rounded-lg font-body-md text-body-md">
          {error}
        </div>
      )}

      {/* 30/70 Layout */}
      <div className="flex flex-col lg:flex-row gap-lg items-start">
        {/* Left Column: Advanced Filters (30%) */}
        <aside className="w-full lg:w-[30%] min-w-[280px] bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-[0px_1px_3px_rgba(0,0,0,0.1)] lg:sticky lg:top-24">
          <div className="flex items-center gap-sm mb-lg border-b border-outline-variant pb-sm">
            <span className="material-symbols-outlined text-primary-container" style={{fontVariationSettings: "'FILL' 1"}}>tune</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Advanced Filters</h3>
          </div>
          
          <div className="flex flex-col gap-lg">
            {/* Slider: Min Match Score */}
            <div className="flex flex-col gap-sm">
              <div className="flex justify-between items-center">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Min Match Score</label>
                <span className="font-label-md text-label-md text-primary-container font-bold">{minScore}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={minScore} 
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full accent-primary-container"
              />
            </div>

            {/* Slider: Role Similarity */}
            <div className="flex flex-col gap-sm">
              <div className="flex justify-between items-center">
                <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Role Similarity</label>
                <span className="font-label-md text-label-md text-primary-container font-bold">{roleSimilarity}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={roleSimilarity} 
                onChange={(e) => setRoleSimilarity(Number(e.target.value))}
                className="w-full accent-primary-container"
              />
            </div>

            {/* Input: Location */}
            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Location</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">location_on</span>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-shadow" 
                  placeholder="e.g. San Francisco, Remote" 
                />
              </div>
            </div>

            {/* Input: Max Years Experience */}
            <div className="flex flex-col gap-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant font-semibold">Max Years Experience</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">work_history</span>
                <input 
                  type="number" 
                  value={maxExp}
                  onChange={(e) => setMaxExp(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-shadow" 
                  placeholder="e.g. 5" 
                />
              </div>
            </div>

            {/* Button: Apply */}
            <button 
              onClick={handleApplyFilters}
              className="w-full mt-sm bg-primary-container text-on-primary-container font-label-md text-label-md font-semibold py-3 rounded-lg hover:bg-primary transition-colors shadow-sm active:scale-[0.98]"
            >
              Apply Filters
            </button>
          </div>
        </aside>

        {/* Right Column: Neural Match Feed (70%) */}
        <section className="w-full lg:flex-1 flex flex-col gap-md">
          <div className="flex justify-between items-center mb-sm px-sm">
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
              {jobs.length > 0 ? "Top Neural Matches" : isLoadingJobs ? "Searching..." : "Latest Database Jobs"}
            </h3>
            <button className="flex items-center gap-xs font-label-sm text-label-sm text-primary-container font-semibold hover:text-primary transition-colors">
              Sort by Match %
              <span className="material-symbols-outlined text-[16px]">sort</span>
            </button>
          </div>

          {isLoadingJobs ? (
            // Loading Skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <article key={i} className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm flex flex-col gap-md opacity-60 pointer-events-none animate-pulse">
                <div className="flex justify-between items-start gap-md">
                  <div className="w-1/2">
                    <div className="h-6 bg-surface-container-high rounded w-full mb-2"></div>
                    <div className="h-4 bg-surface-container-high rounded w-2/3"></div>
                  </div>
                  <div className="flex flex-col items-end gap-xs">
                    <div className="h-6 bg-surface-container-high rounded-full w-24"></div>
                    <div className="h-6 bg-surface-container-high rounded-full w-20"></div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-4 bg-surface-container-high rounded w-20"></div>
                  <div className="h-4 bg-surface-container-high rounded w-24"></div>
                </div>
                <div className="h-12 bg-surface-container-high rounded w-full"></div>
              </article>
            ))
          ) : jobs.length > 0 ? (
            jobs.map((job, idx) => (
              <NeuralMatchCard key={job.id} job={job} index={idx} />
            ))
          ) : (
            <div className="bg-surface-container-lowest rounded-xl p-xl border border-outline-variant shadow-sm text-center">
              <span className="material-symbols-outlined text-[48px] text-surface-variant mb-4">search_off</span>
              <p className="font-body-lg text-body-lg text-on-surface-variant">No matches found for your criteria.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
