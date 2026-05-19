const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware"); 

const ctrl = require("../controllers/claimController");
const commentCtrl = require("../controllers/commentController");

router.post("/", auth, upload.single("document"), ctrl.createClaim);
router.get("/", auth, ctrl.getClaims);
router.get("/:id", auth, ctrl.getClaimById);
router.put("/:id", auth, role("officer"), ctrl.updateStatus);
router.put("/:id/assign", auth, role("officer"), ctrl.assignOfficer);

// SECURE ADMIN MAPPING TUNNEL LINKED TO THE ROUTE ENGINE
router.delete("/:id", auth, role("admin"), ctrl.deleteClaim);
// 🚀 NEW ADMIN ROUTE FOR COMPILING USERS ACCOUNT RECORD DATA
router.get("/admin/officers", auth, role("admin"), ctrl.getOfficerDirectory);

router.post("/comment", auth, commentCtrl.addComment);
router.get("/comment/:claimId", auth, commentCtrl.getComments);

module.exports = router;