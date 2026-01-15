export function startFundraiserFlow({ isAuthed, navigate, openAuthModal }) {
    if (!isAuthed) {
      // show modal first, then redirect to signup
      openAuthModal({
        title: "Sign up required",
        message: "You need to sign up (or login) before starting a fundraiser.",
        confirmText: "Go to Sign Up",
        onConfirm: () => {
          // after signup we can redirect back to category screen
          navigate("/signup?next=/fundraisers/category");
        },
      });
      return;
    }
  
    // authed -> go to category choose screen (your screenshot)
    navigate("/fundraisers/category");
  }
  