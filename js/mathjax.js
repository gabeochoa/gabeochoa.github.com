MathJax.Hub.Config({
                   tex2jax: {
                   skipTags: ['script', 'noscript', 'style', 'textarea', 'pre']
                   }
                   });

MathJax.Hub.Queue(function() {
                  var all = MathJax.Hub.getAllJax(), i;
                  for(i=0; i < all.length; i += 1) {
                  all[i].SourceElement().parentNode.className += ' has-jax';
                  }
                  });