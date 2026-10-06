import { USER_ROLE } from "../modules/User/user.constant";
import { User } from "../modules/User/user.model";
import { Notice } from "../modules/Notice/notice.model";
import { Marquee } from "../modules/Marquee/marquee.model";
import { Gallery } from "../modules/Gallery/gallery.model";
import { Member } from "../modules/Member/member.model";
import { StatCounter } from "../modules/Stats/stats.model";

const superAdminUser = {
  id: "0001",
  email: "asif@gmail.com",
  password: "admin12345",
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  status: "active",
  isDeleted: false,
};

const adminUser = {
  id: "admin",
  email: "admin@friendsgoal.org",
  password: "admin12345",
  needsPasswordChange: false,
  role: USER_ROLE.admin,
  status: "active",
  isDeleted: false,
};

const seedInitialCMSData = async () => {
  // Seed Marquee items if empty
  const marqueeCount = await Marquee.countDocuments();
  if (marqueeCount === 0) {
    await Marquee.create([
      {
        text: {
          bn: "বার্ষিক সাধারণ সভা: আগামী ১৫ আগস্ট ২০২৬ তারিখ সন্ধ্যা ৬:০০ টায় অনুষ্ঠিত হবে",
          en: "Upcoming General Meeting: Join us on 15 August 2026 at 6:00 PM",
        },
        link: "/notice/annual-general-assembly-2026",
        isActive: true,
        priority: 1,
      },
      {
        text: {
          bn: "মাসিক সঞ্চয় জমা ও মুনাফা বন্টন বিবরণী আপডেট হয়েছে",
          en: "Monthly Savings Deposit & Profit Distribution Statement Updated",
        },
        link: "/notice/monthly-savings-update",
        isActive: true,
        priority: 2,
      },
      {
        text: {
          bn: "নতুন তরুণ উদ্যোক্তা তহবিল শুভ সূচনা — আবেদনপত্র গ্রহণ চলছে",
          en: "Youth Entrepreneurship Growth Fund — Open for Member Applications",
        },
        link: "/notice/youth-entrepreneurship-fund-launch",
        isActive: true,
        priority: 3,
      },
    ]);
    console.log("CMS Seeded: Initial Marquee Ticker items created.");
  }

  // Seed Stat Counters if empty
  const statCount = await StatCounter.countDocuments({ isDeleted: false });
  if (statCount === 0) {
    await StatCounter.create([
      {
        key: "active_members",
        value: "111+",
        label: { bn: "সক্রিয় সদস্য", en: "Active Members" },
        order: 1,
      },
      {
        key: "total_projects",
        value: "70+",
        label: { bn: "প্রকল্পসমূহ", en: "Total Projects" },
        order: 2,
      },
      {
        key: "years_of_service",
        value: "3+",
        label: { bn: "সেবার বছর", en: "Years of Service" },
        order: 3,
      },
    ]);
    console.log("CMS Seeded: Initial Home Page Stat Counters created.");
  }

  // Seed Notices if empty
  const noticeCount = await Notice.countDocuments({ isDeleted: false });
  if (noticeCount === 0) {
    await Notice.create([
      {
        title: {
          bn: "বার্ষিক সাধারণ সভা ২০২৬ সংক্রান্ত জরুরী বিজ্ঞপ্তি",
          en: "Urgent Notice Regarding Annual General Assembly 2026",
        },
        description: {
          bn: "আগামী ১৫ই অক্টোবর ফ্রেন্ডস গোলের বার্ষিক সাধারণ সভা অনুষ্ঠিত হতে যাচ্ছে। সকল সদস্যকে উপস্থিত থাকার অনুরোধ করা হচ্ছে।",
          en: "The Annual General Assembly of Friends Goal will be held on October 15th. All members are requested to attend.",
        },
        content: {
          bn: "<p>সম্মানিত ফ্রেন্ডস গোল সদস্যবৃন্দ,</p><p>আমাদের সংগঠনের বার্ষিক সঞ্চয় উন্নয়ন ও ভবিষ্যৎ বিনিয়োগ পরিকল্পনা নিয়ে আলোচনা করার লক্ষ্যে আগামী ১৫ই অক্টোবর সকাল ১০:০০ টায় সংগঠনের প্রধান কার্যালয়ে সভা শুরু হবে। সভার মূল এজেন্ডাসমূহ:</p><ul><li>গত বছরের আর্থিক প্রতিবেদন উপস্থাপন</li><li>নতুন বিনিয়োগ তহবিল অনুমোদন</li><li>পর্ষদ সদস্য পদ নির্বাচন ও মূল্যায়ন</li></ul><p>আপনার উপস্থিতি একান্ত কাম্য।</p>",
          en: "<p>Respected Friends Goal Members,</p><p>The Annual General Assembly will take place at the main organization office on October 15th at 10:00 AM. Key agenda points include financial reporting, new investment pool approval, and council leadership review.</p>",
        },
        images: [
          "/images/hero/hero-1.png",
          "/images/hero/hero-2.png"
        ],
        isTickerActive: true,
        author: "Admin",
        slug: "annual-general-assembly-2026",
      },
      {
        title: {
          bn: "মাসিক সঞ্চয় জমা ও মুনাফা বন্টন প্রক্রিয়া আপডেট",
          en: "Monthly Savings Deposit & Profit Distribution Process Update",
        },
        description: {
          bn: "চলতি মাসের সঞ্চয় জমা দেওয়ার শেষ তারিখ আগামী ২০ তারিখ। সময়মত জমা নিশ্চিত করুন।",
          en: "The deadline for this month's savings deposit is the 20th. Please ensure timely payment.",
        },
        content: {
          bn: "<p>সুপ্রিয় সদস্যবৃন্দ,</p><p>আমাদের স্বসংক্রিয় পেমেন্ট ও বিকাশ/নগদ ডিজিটাল সংগ্রাহকের মাধ্যমে আপনার মাসিক নির্ধারিত সঞ্চয় জমা দিন। যে সকল সদস্য ইতিমধ্যেই মেয়াদ পার করেছেন তারা অবিলম্বে পেন্ডিং অসামঞ্জস্য দূর করুন।</p>",
          en: "<p>Dear Members,</p><p>Please clear your monthly savings via our digital collection channels. Ensure your balance is updated prior to the profit distribution calculation.</p>",
        },
        images: ["/images/about/about-1.png"],
        isTickerActive: false,
        author: "Finance Team",
        slug: "monthly-savings-update",
      },
      {
        title: {
          bn: "নতুন তরুণ উদ্যোক্তা তহবিল শুভ সূচনা",
          en: "Launch of Youth Entrepreneurship Growth Fund",
        },
        description: {
          bn: "আমাদের সুদমুক্ত সঞ্চয় থেকে গঠিত নতুন বাণিজ্যিক প্রকল্প ও বিনিয়োগ চালুর বিস্তারিত তথ্য।",
          en: "Details on our newly established interest-free commercial project pool.",
        },
        content: {
          bn: "<p>ফ্রেন্ডস গোলের পক্ষ থেকে অত্যন্ত আনন্দের সাথে জানানো যাচ্ছে যে আমাদের তরুণ উদ্যোক্তা বিনিয়োগ তহবিলের শুভ উদ্বোধন করা হয়েছে। আগ্রহীরা আবেদনের মাধ্যমে অংশগ্রহণ করতে পারবেন।</p>",
          en: "<p>Friends Goal is proud to launch the Youth Entrepreneurship Growth Fund. Interested members can apply for zero-interest project financing.</p>",
        },
        images: ["/images/hero/hero-3.png"],
        isTickerActive: false,
        author: "Executive Committee",
        slug: "youth-entrepreneurship-fund-launch",
      }
    ]);
    console.log("CMS Seeded: Initial dynamic notices created.");
  }

  // Seed Gallery if empty
  const galleryCount = await Gallery.countDocuments({ isDeleted: false });
  if (galleryCount === 0) {
    await Gallery.create([
      {
        title: {
          bn: "কৌশলগত আর্থিক কর্মশালা",
          en: "Strategic Financial Workshop",
        },
        subtitle: {
          bn: "দীর্ঘমেয়াদী বিনিয়োগ মডেল নিয়ে সদস্যদের যৌথ পর্যালোচনা",
          en: "Members collaborating on long-term investment models",
        },
        images: ["/images/hero/hero-2.png"],
        category: "workshop",
      },
      {
        title: {
          bn: "বার্ষিক সাধারণ সমাবেশ",
          en: "Annual Community Assembly",
        },
        subtitle: {
          bn: "স্বচ্ছ ও গণতান্ত্রিক পর্ষদ প্রতিবেদন উপস্থাপনা",
          en: "Transparent democratic board reporting",
        },
        images: ["/images/hero/hero-1.png"],
        category: "assembly",
      },
      {
        title: {
          bn: "মিউচুয়াল ফান্ড প্রকল্প পর্যালোচনা",
          en: "Mutual Fund Project Review",
        },
        subtitle: {
          bn: "সুদমুক্ত সঞ্চয় তহবিল বন্টন ও সুষম ব্যবস্থাপনা",
          en: "Interest-free savings allocation & distribution",
        },
        images: ["/images/about/about-1.png"],
        category: "event",
      },
      {
        title: {
          bn: "ঐক্য ও পারস্পরিক সহায়তা সমাবেশ",
          en: "Unity & Support Gathering",
        },
        subtitle: {
          bn: "সারাদেশে সম্প্রদায়ের বন্ধন সুদৃঢ়করণ",
          en: "Strengthening community bonds nationwide",
        },
        images: ["/images/hero/hero-3.png"],
        category: "event",
      },
      {
        title: {
          bn: "যুব ক্ষমতায়ন উদ্যোগ",
          en: "Youth Empowerment Initiative",
        },
        subtitle: {
          bn: "ভাগ করা দৃষ্টিভঙ্গির মাধ্যমে স্বনির্ভর জীবন গঠন",
          en: "Building self-reliant lives through shared vision",
        },
        images: ["/images/hero/hero-5.png"],
        category: "workshop",
      }
    ]);
    console.log("CMS Seeded: Initial photo gallery items created.");
  }

  // Seed Council Members if empty
  const memberCount = await Member.countDocuments({ isDeleted: false });
  if (memberCount === 0) {
    await Member.create([
      {
        memberCode: "001",
        memberId: "FG-001",
        fullName: "MD BELAL HOSSAIN",
        name: { bn: "মো: বেলায়েত হোসেন", en: "MD BELAL HOSSAIN" },
        email: "belal@friendsgoal.org",
        mobileNo: "+8801700000001",
        phone: "+8801700000001",
        designation: "SECRETARY",
        designationBn: "সচিব",
        roleTitle: { bn: "সাধারণ সম্পাদক", en: "SECRETARY" },
        councilCategory: "core_leadership",
        councilType: "executive",
        role: "admin",
        district: "Dhaka",
        bloodGroup: "O+",
        photoUrl: "/images/hero/hero-1.png",
        pictureUrl: "/images/hero/hero-1.png",
        status: "active",
      },
      {
        memberCode: "002",
        memberId: "FG-002",
        fullName: "KAZI ARIFUL ISLAM",
        name: { bn: "কাজী আরিফুল ইসলাম", en: "KAZI ARIFUL ISLAM" },
        email: "ariful@friendsgoal.org",
        mobileNo: "+8801700000002",
        phone: "+8801700000002",
        designation: "TREASURER",
        designationBn: "কোষাধ্যক্ষ",
        roleTitle: { bn: "অর্থ সম্পাদক", en: "TREASURER" },
        councilCategory: "financial_leadership",
        councilType: "financial",
        role: "admin",
        district: "Chittagong",
        bloodGroup: "A+",
        photoUrl: "/images/hero/hero-3.png",
        pictureUrl: "/images/hero/hero-3.png",
        status: "active",
      },
      {
        memberCode: "003",
        memberId: "FG-003",
        fullName: "SYED RASHED CHOWDHURY",
        name: { bn: "সৈয়দ রাশেদ চৌধুরী", en: "SYED RASHED CHOWDHURY" },
        email: "rashed@friendsgoal.org",
        mobileNo: "+8801700000003",
        phone: "+8801700000003",
        designation: "FINANCIAL AUDITOR",
        designationBn: "আর্থিক অডিটর",
        roleTitle: { bn: "আর্থিক অডিটর", en: "FINANCIAL AUDITOR" },
        councilCategory: "financial_leadership",
        councilType: "financial",
        role: "admin",
        district: "Sylhet",
        bloodGroup: "B+",
        photoUrl: "/images/about/about-1.png",
        pictureUrl: "/images/about/about-1.png",
        status: "active",
      }
    ]);
    console.log("CMS Seeded: Initial council members created.");
  }
};

const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExists = await User.findOne({
      $or: [{ role: USER_ROLE.superAdmin }, { email: "asif@gmail.com" }, { id: "0001" }],
    });

    if (!isSuperAdminExists) {
      await User.create(superAdminUser);
      console.log("Super Admin seeded: 0001 / asif@gmail.com (password: admin12345)");
    }

    const isAdminExists = await User.findOne({
      $or: [{ email: "admin@friendsgoal.org" }, { id: "admin" }],
    });

    if (!isAdminExists) {
      await User.create(adminUser);
      console.log("Admin seeded: admin / admin@friendsgoal.org (password: admin12345)");
    }

    await seedInitialCMSData();
  } catch (err) {
    console.warn("Seeding admin / CMS error:", err);
  }
};

export default seedSuperAdmin;

