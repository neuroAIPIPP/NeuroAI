'use client';

import Navbar from '@/components/Navbar';
import SessionAIInsightsCard from '@/components/session/SessionAIInsightsCard';
import SessionAIModulesCard from '@/components/session/SessionAIModulesCard';
import SessionFinishedScreen from '@/components/session/SessionFinishedScreen';
import SessionHeader from '@/components/session/SessionHeader';
import SessionStatusCard from '@/components/session/SessionStatusCard';
import SessionVideoSection from '@/components/session/SessionVideoSection';
import SessionWebcamSection from '@/components/session/SessionWebcamSection';
import { useSessionManager } from '@/hooks/useSessionManager';
import React from 'react';

export default function SessionPage() {
  const session = useSessionManager();

  if (session.isFinished) {
    return (
      <>
        <Navbar />
        <SessionFinishedScreen onGoToDashboard={session.handleGoToDashboard} />
      </>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-transparent">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-100/30 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-yellow-100/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      <Navbar />

      <div className="pt-28 pb-12 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen flex flex-col relative z-10">
        <SessionHeader
          isActive={session.isActive}
          onToggleActive={() => session.setIsActive(!session.isActive)}
          elapsedTime={session.elapsedTime}
          formatTime={session.formatTime}
          onRecalibrate={session.handleRecalibrate}
          onSaveSession={() => session.saveSessionData(true)}
          isSaving={session.isSaving}
          canEndSession={
            session.currentVideoIndex >= session.videos.length - 1 &&
            session.surveyAnswered
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Video Section */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <SessionVideoSection
              videoRef={session.videoRef}
              currentVideo={session.currentVideo}
              isActive={session.isActive}
              showSurvey={session.showSurvey}
              surveyAnswered={session.surveyAnswered}
              videoProgress={session.videoProgress}
              onVideoEnded={session.handleVideoEnded}
              onTimeUpdate={(e) => {
                const video = e.target as HTMLVideoElement;
                session.setVideoProgress(
                  (video.currentTime / video.duration) * 100,
                );
              }}
              onSurveySubmit={session.handleSurveySubmit}
              onNextVideo={session.handleNextVideo}
              isSaving={session.isSaving}
              currentVideoIndex={session.currentVideoIndex}
              totalVideos={session.videos.length}
            />
          </div>

          {/* Sidebar / Metrics Section */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <SessionWebcamSection
              webcamVideoRef={session.webcamVideoRef}
              isActive={session.isActive}
              trackingData={session.trackingData}
            />

            <SessionStatusCard
              isActive={session.isActive}
              showSurvey={session.showSurvey}
              elapsedTime={session.elapsedTime}
              formatTime={session.formatTime}
            />

            <SessionAIModulesCard
              eegRecording={session.eegRecording}
              eegMode={session.eegMode}
              isTracking={session.isTracking}
              error={session.error}
              trackingData={session.trackingData}
              faceVerified={session.faceVerified}
              faceVerifyResult={session.faceVerifyResult}
            />

            <SessionAIInsightsCard
              isTracking={session.isTracking}
              trackingData={session.trackingData}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
