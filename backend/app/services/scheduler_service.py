from datetime import datetime, timezone

from firebase_admin import firestore

from app.services.email_service import send_email

db = firestore.client()


def process_scheduled_emails():
    now = datetime.now(timezone.utc)

    print(
        f"[SCHEDULER] Checking scheduled emails at "
        f"{now.isoformat()}"
    )

    processed_count = 0

    # Get all users
    users = db.collection("users").stream()

    for user_doc in users:
        user_id = user_doc.id

        # Get this user's emails
        emails_ref = (
            db.collection("users")
            .document(user_id)
            .collection("emails")
        )

        email_docs = emails_ref.stream()

        for email_doc in email_docs:
            try:
                email_data = email_doc.to_dict()

                # Only process scheduled emails
                if email_data.get("status") != "SCHEDULED":
                    continue

                scheduled_at = email_data.get("scheduled_at")

                if not scheduled_at:
                    print(
                        f"[SCHEDULER] Skipping {email_doc.id}: "
                        "scheduled_at is missing"
                    )
                    continue

                # Firestore timestamps are normally timezone-aware,
                # but handle naive timestamps safely.
                if scheduled_at.tzinfo is None:
                    scheduled_at = scheduled_at.replace(
                        tzinfo=timezone.utc
                    )

                # Not due yet
                if scheduled_at > now:
                    continue

                email_id = email_doc.id

                print(
                    f"[SCHEDULER] Processing email {email_id} "
                    f"for user {user_id}"
                )

                # IMPORTANT:
                # Do NOT manually set SENDING here.
                # send_email() already changes the status to SENDING.
                sent_message, error = send_email(
                    user_id=user_id,
                    email_id=email_id,
                )

                if error:
                    print(
                        f"[SCHEDULER] Failed email "
                        f"{email_id}: {error}"
                    )
                else:
                    print(
                        f"[SCHEDULER] Successfully sent email "
                        f"{email_id}"
                    )

                processed_count += 1

            except Exception as e:
                print(
                    f"[SCHEDULER] Error processing email "
                    f"{email_doc.id}: {repr(e)}"
                )

    print(
        f"[SCHEDULER] Finished. "
        f"Processed {processed_count} email(s)."
    )