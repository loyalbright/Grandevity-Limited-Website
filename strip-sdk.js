import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup directories
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gameDir = path.join(__dirname, 'public', 'games', 'kiwi-defenders');

// The replacement Stub object
const stubManager = `// --- 🎮 Pure Version Manager (SDK Stripped) ---
    const CG_Manager = {
        isPaused: false, 

        init: async function() {
            console.log("Demo Mode: SDK Disabled. Running pure Web version.");
        },

        startGameplay: function() {},
        stopGameplay: function() {},

        playAd: function(type = 'midgame') {
            console.log("Demo Mode: Ad skipped.");
            this.resumeGame();
        },

        pauseGame: function() {
            this.isPaused = true;
            if (typeof bgm !== 'undefined' && !bgm.paused) {
                bgm.pause();
            }
        },

        resumeGame: function() {
            this.isPaused = false;
            if (typeof musicPlaying !== 'undefined' && musicPlaying) {
                bgm.play().catch(e => {});
            }
        }
    };`;

async function processGameFiles() {
    try {
        const files = fs.readdirSync(gameDir);
        const htmlFiles = files.filter(file => file.endsWith('.html'));

        if (htmlFiles.length === 0) {
            console.log("❌ No HTML files found in " + gameDir);
            return;
        }

        let updatedCount = 0;

        for (const file of htmlFiles) {
            const filePath = path.join(gameDir, file);
            let content = fs.readFileSync(filePath, 'utf8');
            let hasChanges = false;

            // Modification 1: Remove CrazyGames SDK Script
            const scriptRegex = /<script\s+src=["']https:\/\/sdk\.crazygames\.com\/crazygames-sdk-v3\.js["'][^>]*><\/script>\s*/gi;
            if (scriptRegex.test(content)) {
                content = content.replace(scriptRegex, '');
                hasChanges = true;
            }

            // Modification 2: Replace CG_Manager
            // This matches 'const CG_Manager = {' down to the closing '};'
            const managerRegex = /const\s+CG_Manager\s*=\s*\{[\s\S]*?\n\s*\};/g;
            if (managerRegex.test(content)) {
                content = content.replace(managerRegex, stubManager);
                hasChanges = true;
            }

            if (hasChanges) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`✅ Stripped and stubbed: ${file}`);
                updatedCount++;
            } else {
                console.log(`⏭️  Skipped (no changes needed): ${file}`);
            }
        }

        console.log(`\n🎉 Success! Updated ${updatedCount} HTML files.`);

    } catch (error) {
        console.error("🚨 Error processing files:", error.message);
    }
}

processGameFiles();