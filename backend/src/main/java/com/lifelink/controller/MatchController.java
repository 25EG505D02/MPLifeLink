package com.lifelink.controller;

import com.lifelink.dto.MatchResponseDto;
import com.lifelink.service.MatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping("/provider")
    public ResponseEntity<List<MatchResponseDto>> getMatchesForProvider() {
        return ResponseEntity.ok(matchService.getMatchesForCurrentProvider());
    }

    @GetMapping("/recipient")
    public ResponseEntity<List<MatchResponseDto>> getMatchesForRecipient() {
        return ResponseEntity.ok(matchService.getMatchesForCurrentRecipient());
    }

    @GetMapping("/resource/{resourceId}")
    public ResponseEntity<List<MatchResponseDto>> getMatchesForResource(@PathVariable Long resourceId) {
        return ResponseEntity.ok(matchService.getMatchesForResource(resourceId));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<MatchResponseDto> acceptMatch(@PathVariable Long id) {
        return ResponseEntity.ok(matchService.acceptMatch(id));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<MatchResponseDto> rejectMatch(@PathVariable Long id) {
        return ResponseEntity.ok(matchService.rejectMatch(id));
    }
}
