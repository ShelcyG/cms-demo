<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CMS Demo Site</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9f9f7; color: #1a1a1a; line-height: 1.6; }

    nav { background: #fff; border-bottom: 1px solid #e8e8e8; padding: 0 24px; display: flex; align-items: center; height: 60px; }
    .nav-logo { font-size: 18px; font-weight: 600; color: #1a1a1a; text-decoration: none; }

    .page-wrap { max-width: 860px; margin: 0 auto; padding: 40px 20px 80px; }
    .section-heading { font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #888; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid #e8e8e8; }

    /* Blog listing */
    #blogs { display: flex; flex-direction: column; gap: 32px; margin-bottom: 64px; }

    .blog-card { background: #fff; border: 1px solid #e8e8e8; border-radius: 12px; overflow: hidden; transition: box-shadow 0.15s; cursor: pointer; }
    .blog-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

    .card-cover { width: 100%; height: 240px; overflow: hidden; }
    .card-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }

    .card-body { padding: 24px; }
    .card-title { font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 12px; line-height: 1.3; }

    .card-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
    .avatar { width: 32px; height: 32px; border-radius: 50%; background: #e8e4fc; color: #5a45c8; font-size: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .author-name { font-size: 14px; font-weight: 500; color: #333; }
    .dot { color: #bbb; }
    .post-date { font-size: 13px; color: #888; }
    .card-excerpt { font-size: 15px; color: #555; line-height: 1.6; }

    /* Single post */
    .single-post { max-width: 720px; margin: 0 auto; display: none; }
    .post-cover { width: 100%; height: 380px; overflow: hidden; border-radius: 12px; margin-bottom: 32px; }
    .post-cover img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .post-title { font-size: 32px; font-weight: 700; color: #1a1a1a; line-height: 1.25; margin-bottom: 16px; }
    .post-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; }
    .post-meta .avatar { width: 40px; height: 40px; font-size: 14px; }
    .meta-text { display: flex; flex-direction: column; gap: 2px; }
    .meta-text .author-name { font-size: 14px; font-weight: 500; }
    .meta-text .post-date { font-size: 13px; color: #888; }

    .post-body { font-size: 17px; line-height: 1.75; color: #222; }
    .post-body h1, .post-body h2, .post-body h3 { font-weight: 700; margin: 2em 0 0.6em; color: #111; }
    .post-body h1 { font-size: 26px; } .post-body h2 { font-size: 22px; } .post-body h3 { font-size: 18px; }
    .post-body p { margin-bottom: 1.2em; }
    .post-body ul, .post-body ol { margin: 0 0 1.2em 1.5em; }
    .post-body li { margin-bottom: 0.4em; }
    .post-body strong { font-weight: 600; }
    .post-body a { color: #5a45c8; }
    .post-body img { max-width: 100%; border-radius: 10px; margin: 24px 0; display: block; }

    .back-btn { display: inline-flex; align-items: center; gap: 6px; margin-bottom: 32px; font-size: 14px; color: #5a45c8; background: none; border: none; cursor: pointer; padding: 0; }
    .back-btn:hover { text-decoration: underline; }

    /* Photos */
    #photos { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .photo-card { background: #fff; border: 1px solid #e8e8e8; border-radius: 10px; overflow: hidden; }
    .photo-card img { width: 100%; height: 180px; object-fit: cover; display: block; }
    .photo-caption { padding: 10px 12px; font-size: 13px; color: #555; }

    .empty-msg { font-size: 14px; color: #aaa; padding: 24px 0; }
    .loading { font-size: 14px; color: #aaa; padding: 24px 0; }

    #listing-view { display: block; }

    @media (max-width: 600px) {
      .post-title { font-size: 24px; }
      .post-cover { height: 220px; }
      .card-cover { height: 180px; }
      .card-title { font-size: 18px; }
    }
  </style>
</head>
<body>

  <nav>
    <a href="#" class="nav-logo" onclick="showListing()">My Demo Site</a>
  </nav>

  <div class="page-wrap">

    <!-- LISTING VIEW -->
    <div id="listing-view">
      <p class="section-heading">Latest Posts</p>
      <div id="blogs"><p class="loading">Loading posts…</p></div>

      <p class="section-heading" style="margin-top:48px">Photos</p>
      <div id="photos"><p class="loading">Loading photos…</p></div>
    </div>

    <!-- SINGLE POST VIEW -->
    <div id="post-view" style="display:none">
      <button class="back-btn" onclick="showListing()">← Back to all posts</button>
      <div class="single-post" id="single-post-content"></div>
    </div>

  </div>

  <script src="load-content.js"></script>
</body>
</html>
