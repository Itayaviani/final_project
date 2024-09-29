import React, { useEffect } from 'react';
import './feminineLook.css';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

function FeminineLook() {
    useEffect(() => {
        // Scroll to top on component mount
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="feminine-look-container">
            <section className="header-section">
                <h1>מבט נשי בעקבות השראה</h1>
                <p>סדנה קבוצתית בעקבות דמויות מעוררות השראה</p>
                <p>
                    אני מזמינה אותך לחוות תהליך נשי אישי וקבוצתי בעקבות אישיות נשית שמעוררת בך השראה.
                    בואי לצמוח מתוך החיבור, להכניס סקרנות ומשחקיות לשגרה שלך, להתקרב לעצמך, להתפתח,
                    לצמוח, לבטא את עצמך ולהניע בתוכך תנועת חיים חדשה.
                </p>
            </section>

            <div className="grid-layout">
                <section className="inspiration-section">
                    <h2>מהו התחום שבו את רוצה לייצר שינוי?</h2>
                    <p>
                        בריאות, קריירה, זוגיות, הורות, את עצמך - באיזה תחום את רוצה לייצר שינוי?
                    </p>
                    <p>
                        אומץ, שמחה, אהבה עצמית או אולי אופטימיות - איזו תכונה יכולה לעזור לך לממש את השינוי שאת רוצה?
                    </p>
                    <p>
                        חנה סנש, קוקו שאנל, אמא תרזה או אשה אחרת - איזו אישיות מעוררת בך השראה?
                    </p>
                    <p>
                        להשראה יש כוח לעורר תשוקה, לפתוח את הלב, למלא התרגשות, שמחה, התלהבות, מוטיבציה ולייצר תנועה והגשמה.
                    </p>
                </section>

                <section className="invite-section">
                    <h2>אני מזמינה אותך לחוות ולגלות מה השראה מעוררת בתוכך</h2>
                    <p>
                        לחוש התחקות אחרי אישה עם איכויות שאת רוצה לחזק בעצמך, לפגוש עוד חלקים שלך ולתת להם ביטוי.
                        להיות שותפה ביצירה אומנותית נשית שנרקמת מתוך מפגש וחיבור.
                    </p>
                    <p>מחכה לפגוש אותך בסדנה הקרובה : השאירי פרטים בטופס ואחזור אליך</p>
                </section>

                <section className="contact-section">
                    <form>
                        <input type="text" placeholder="∗ שם פרטי" required />
                        <input type="email" placeholder="∗ מייל" required />
                        <input type="tel" placeholder="∗ נייד" required />
                        <div className="consent">
                            <input type="checkbox" id="consent" name="consent" required />
                            <label htmlFor="consent">אני מרשה לשלוח לי דיוור במייל ו/או SMS</label>
                        </div>
                        <button type="submit">אשמח לשמוע יותר על הסדנה</button>
                    </form>
                </section>

                <section className="quote-section">
                    <blockquote>
                        "השראה היא ניצוץ של אפשרות שפותח לאדם ערוץ חיבור למקור שיצר את כל הדברים ומאפשר לו נגישות לאינטליגנציה שנמצאת מעבר למוחו"
                        <span>- יואב זילכה</span>
                    </blockquote>
                </section>

                <section className="workshop-details-section">
                    <h2>מה נעשה ביחד בסדנה?</h2>
                    <div className="step">
                        <h3>שלב 1 - התבוננות אישית</h3>
                        <p>
                            נקדיש זמן להתבוננות אישית, מודעות עצמית וחיבור פנימי. נעסוק בשאלות: מה נוכח בי? איזה רצון חי בי? מה בתוכי מבקש שינוי? מה אני רוצה לחזק בעצמי? מה יעזור לי להגשים את הרצון שלי?
                        </p>
                    </div>
                    <div className="step">
                        <h3>שלב 2 - בחירת דמות</h3>
                        <p>
                            נפתח בסקרנות לקבל השראה מדמות נשית. נחקור את הדמות, נתחקה אחריה, נכניס אותה במשחקיות לתוך חיינו, נחייה אותה בתוכנו ונכתוב טקסט שמתאר את החיבור לדמות.
                        </p>
                    </div>
                    <div className="step">
                        <h3>שלב 3 - תערוכת צילומים</h3>
                        <p>
                            נתחקה ונצטלם בדמות שבחרנו ונחתום את התהליך בערב אומנותי שבו תוצג תערוכת הצילומים שלנו, לצד הטקסטים המתארים את ההשראה.
                        </p>
                    </div>
                </section>

                <section className="about-section">
                    <h2>מה כוללת הסדנה?</h2>
                    <p>8 מפגשים קבוצתיים (משך מפגש - 3 שעות)</p>
                    <p>יום צילומים</p>
                    <p>2 מפגשי היערכות לתערוכה</p>
                    <p>אירוע השקת התערוכה אליו תזמינו את קרוביכם</p>
                    <p>
                        הסדנה בהשראת תערוכת "זכות הבחירה" של האמנית שיבולת גילת (ז"ל), שהתקיימה לפני מספר שנים בקיבוץ יד מרדכי.
                    </p>
                </section>

                <section className="about-me-section">
                    <h2>נעים להכיר</h2>
                    <p>
                        אני טלי גל, נשואה ואמא לשלושה, גרה בקיבוץ שדות ים, חיה ונושמת תודעה.
                        מלווה אנשים, מנהלים וארגונים בתהליכים תודעתיים ליצירת שינוי מתוך חיבור, משמעות ובחירה.
                        חוקרת איך התודעה משפיעה על המציאות הגשמית ועל האופן שבו אנו חווים את החיים.
                    </p>
                    <p>
                        למדתי ועסקתי במהלך השנים בשני תחומים - הראשון התחום הכלכלי - כלכלה, ניהול, בנקאות, השקעות, פיתוח עסקי וניהול כספים.
                        השני עולם הרוח - מנהיגות, תקשורת מקרבת, אימון וגישור, טיפול דרך התת מודע, פיתוח אירגוני והנחיית קבוצות.
                    </p>
                    <p>
                        הניסיון והידע שצברתי בעולמות החומר והרוח אפשרו לי להבין לעומק את הקשר ביניהם.
                        הבנתי שקיים קשר ישיר ורב השפעה בין התהליכים התודעתיים שאנו עוברים למציאות שאנו פוגשים.
                        מאז אני עוסקת בקידום סינרגיה בין התודעה למציאות. אני מלווה אנשים, מנהלים, קהילות וארגונים
                        בתהליכי התפתחות והגשמה ועוזרת לאנשים להתחבר לעצמם ולהרחיב את הביטוי ע"י אהבה עצמית והוויה חופשית.
                    </p>
                    <p>
                        אני מאמינה שהשראה היא כלי נגיש וחסר גבולות למפגש עם הייחודיות והאותנטיות שבתוכנו ולהנעת תנועת חיים חדשה.
                    </p>
                </section>
            </div>

            <section className="social-media-section">
                <h3>מוזמנת לפגוש אותי גם ברשתות</h3>
                <div className="social-icons">
                    <a href="https://www.facebook.com/share/LQ1PZB68oyWhib3g/?mibextid=qi2Omg" target="_blank" rel="noopener noreferrer"><FaFacebook /> Facebook</a>
                    <a href="https://www.instagram.com/taligal12?utm_source=qr&igsh=MWwzb2w5NHNkdnp0Yg==" target="_blank" rel="noopener noreferrer"><FaInstagram /> Instagram</a>
                    <a href="https://wa.me/972523829170" target="_blank" rel="noopener noreferrer"><FaWhatsapp /> Whatsapp</a>
                </div>
            </section>
        </div>
    );
}

export default FeminineLook;
