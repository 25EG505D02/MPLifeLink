package com.lifelink.dto;

import java.util.Map;

public class AnalyticsSummaryDto {

    private long totalProviders;
    private long totalRecipients;
    private long activeResources;
    private long activeRequests;
    private long pendingVerifications;
    private long totalRedistributions;
    private double totalKgRescued;
    private long mealsServed;
    private double co2OffsetKg;

    private Map<String, Long> categoryDistribution;
    private Map<String, Long> priorityDistribution;
    private Map<String, Long> monthlyActivity;

    public AnalyticsSummaryDto() {}

    public long getTotalProviders() { return totalProviders; }
    public void setTotalProviders(long totalProviders) { this.totalProviders = totalProviders; }

    public long getTotalRecipients() { return totalRecipients; }
    public void setTotalRecipients(long totalRecipients) { this.totalRecipients = totalRecipients; }

    public long getActiveResources() { return activeResources; }
    public void setActiveResources(long activeResources) { this.activeResources = activeResources; }

    public long getActiveRequests() { return activeRequests; }
    public void setActiveRequests(long activeRequests) { this.activeRequests = activeRequests; }

    public long getPendingVerifications() { return pendingVerifications; }
    public void setPendingVerifications(long pendingVerifications) { this.pendingVerifications = pendingVerifications; }

    public long getTotalRedistributions() { return totalRedistributions; }
    public void setTotalRedistributions(long totalRedistributions) { this.totalRedistributions = totalRedistributions; }

    public double getTotalKgRescued() { return totalKgRescued; }
    public void setTotalKgRescued(double totalKgRescued) { this.totalKgRescued = totalKgRescued; }

    public long getMealsServed() { return mealsServed; }
    public void setMealsServed(long mealsServed) { this.mealsServed = mealsServed; }

    public double getCo2OffsetKg() { return co2OffsetKg; }
    public void setCo2OffsetKg(double co2OffsetKg) { this.co2OffsetKg = co2OffsetKg; }

    public Map<String, Long> getCategoryDistribution() { return categoryDistribution; }
    public void setCategoryDistribution(Map<String, Long> categoryDistribution) { this.categoryDistribution = categoryDistribution; }

    public Map<String, Long> getPriorityDistribution() { return priorityDistribution; }
    public void setPriorityDistribution(Map<String, Long> priorityDistribution) { this.priorityDistribution = priorityDistribution; }

    public Map<String, Long> getMonthlyActivity() { return monthlyActivity; }
    public void setMonthlyActivity(Map<String, Long> monthlyActivity) { this.monthlyActivity = monthlyActivity; }
}
